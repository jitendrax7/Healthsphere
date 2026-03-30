

import { useRef, useState, useEffect, useCallback } from 'react';
import { X, Upload, ZoomIn, ZoomOut, Loader2, Camera } from 'lucide-react';
import { doctorApi } from '../../api/axios';

/* ─── constants ─────────────────────────────────────────── */
const PW = 470;  // canvas preview width
const PH = 450;  // canvas preview height  (3:4 portrait)
const OW = 500;  // output width
const OH = 600;  // output height (4:3)
const CROP_PAD = 15;   // px padding inside canvas
const CR = 8;          // crop rect corner radius
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

/* ═══════════════════════════════════════════════════════════ */
const ProfilePhotoModal = ({ onClose, onSuccess }) => {
  const fileRef      = useRef(null);
  const canvasRef    = useRef(null);
  const imgRef       = useRef(null);

  const [src,       setSrc]      = useState(null);   // data URL of chosen image
  const [zoom,      setZoom]     = useState(1);
  const [offset,    setOffset]   = useState({ x: 0, y: 0 });
  const [dragging,  setDragging] = useState(false);
  const [dragStart, setDragStart]= useState({ x: 0, y: 0 });
  const [uploading, setUploading]= useState(false);
  const [error,     setError]    = useState('');

  /* ── Draw canvas ─────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');

    // crop rect coords
    const cx = CROP_PAD, cy = CROP_PAD;
    const cw = PW - CROP_PAD * 2;
    const ch = PH - CROP_PAD * 2;

    // Background
    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, PW, PH);

    // Image (clip to crop rect so it doesn't bleed into padding)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cx, cy, cw, ch, CR);
    ctx.clip();
    const iw = img.naturalWidth  * zoom;
    const ih = img.naturalHeight * zoom;
    const dx = PW / 2 + offset.x - iw / 2;
    const dy = PH / 2 + offset.y - ih / 2;
    ctx.drawImage(img, dx, dy, iw, ih);
    ctx.restore();

    // Dim the padding area outside the crop rect
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, PW, PH);
    ctx.roundRect(cx, cy, cw, ch, CR); // punches out the crop hole
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fill('evenodd');
    ctx.restore();

    // Crop rect border
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cx, cy, cw, ch, CR);
    ctx.strokeStyle = 'rgba(99,102,241,0.85)';
    ctx.lineWidth   = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    // Corner handles
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#6366f1';
    const hl = 12;
    [[cx,cy],[cx+cw,cy],[cx,cy+ch],[cx+cw,cy+ch]].forEach(([hx,hy]) => {
      const sx = hx === cx ? 1 : -1;
      const sy = hy === cy ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(hx + sx*hl, hy); ctx.lineTo(hx, hy); ctx.lineTo(hx, hy + sy*hl);
      ctx.stroke();
    });
    ctx.restore();
  }, [zoom, offset]);

  useEffect(() => { draw(); }, [draw]);

  /* ── Load chosen image ────────────────────────────────────── */
  const loadImage = (dataUrl) => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      // Initial zoom: fill crop box width
      const cw = PW - CROP_PAD * 2;
      const z  = Math.max(MIN_ZOOM, cw / img.naturalWidth);
      setZoom(z);
      setOffset({ x: 0, y: 0 });
      setSrc(dataUrl);
    };
    img.src = dataUrl;
  };

  /* ── File picker ──────────────────────────────────────────── */
  const pickFile = () => fileRef.current?.click();
  const onFile   = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => loadImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /* ── Drag to pan ──────────────────────────────────────────── */
  const clampOffset = useCallback((ox, oy, z) => {
    const img = imgRef.current;
    if (!img) return { x: ox, y: oy };
    const iw  = img.naturalWidth  * z;
    const ih  = img.naturalHeight * z;
    const cw  = PW - CROP_PAD * 2;
    const ch  = PH - CROP_PAD * 2;
    const maxX = Math.max(0, (iw - cw) / 2);
    const maxY = Math.max(0, (ih - ch) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, ox)),
      y: Math.min(maxY, Math.max(-maxY, oy)),
    };
  }, []);

  const onMouseDown = (e) => {
    if (!src) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    e.preventDefault();
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const raw  = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
    setOffset(clampOffset(raw.x, raw.y, zoom));
  };
  const onMouseUp   = () => setDragging(false);

  // Touch support
  const touchStart = (e) => {
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };
  const touchMove = (e) => {
    if (!dragging) return;
    const t   = e.touches[0];
    const raw = { x: t.clientX - dragStart.x, y: t.clientY - dragStart.y };
    setOffset(clampOffset(raw.x, raw.y, zoom));
  };

  /* ── Wheel to zoom ────────────────────────────────────────── */
  const onWheel = (e) => {
    if (!src) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const next  = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
    setZoom(next);
    setOffset(prev => clampOffset(prev.x, prev.y, next));
  };

  /* ── Zoom slider ──────────────────────────────────────────── */
  const onSlider = (e) => {
    const next = Number(e.target.value);
    setZoom(next);
    setOffset(prev => clampOffset(prev.x, prev.y, next));
  };

  /* ── Export & upload ──────────────────────────────────────── */
  const handleUpload = async () => {
    const img = imgRef.current;
    if (!img) return;
    setUploading(true); setError('');

    const out  = document.createElement('canvas');
    out.width  = OW; out.height = OH;
    const ctx  = out.getContext('2d');

    // Scale factor: preview crop area → output
    const cw    = PW - CROP_PAD * 2;
    const ch    = PH - CROP_PAD * 2;
    const scaleX = OW / cw;
    const scaleY = OH / ch;

    // Image draw position in output space
    const iw = img.naturalWidth  * zoom * scaleX;
    const ih = img.naturalHeight * zoom * scaleY;
    const dx = OW / 2 + offset.x * scaleX - iw / 2;
    const dy = OH / 2 + offset.y * scaleY - ih / 2;

    // No clip — straight rectangle (passport photo)
    ctx.drawImage(img, dx, dy, iw, ih);

    out.toBlob(async (blob) => {
      try {
        const form = new FormData();
        form.append('image', blob, 'profile.jpg');
        const res = await doctorApi.uploadProfilePhoto(form);
        const url = res.data?.profilePhoto || res.data?.imageUrl || res.data?.url || '';
        onSuccess(url);
        onClose();
      } catch (err) {
        setError(err.response?.data?.message || 'Upload failed. Please try again.');
      } finally { setUploading(false); }
    }, 'image/jpeg', 0.92);
  };

  /* ── JSX ────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-bold text-white text-base">Update Profile Photo</h2>
          <button onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Canvas area */}
        <div className="p-5 space-y-4">
          {!src ? (
            /* Empty state – click to pick */
            <button onClick={pickFile}
              className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/15 hover:border-primary-500/50 rounded-2xl py-14 transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-primary-500/10 group-hover:bg-primary-500/20 flex items-center justify-center transition-colors">
                <Camera size={26} className="text-primary-400" />
              </div>
              <div className="text-center">
                <p className="text-white/70 font-medium text-sm">Click to choose a photo</p>
                <p className="text-white/30 text-xs mt-1">JPG, PNG, WEBP — portrait / passport size recommended</p>
              </div>
            </button>
          ) : (
            /* Canvas cropper */
            <div className="flex flex-col items-center gap-4">
              <canvas
                ref={canvasRef}
                width={PW}
                height={PH}
                className="rounded-xl cursor-grab active:cursor-grabbing"
                style={{ width: PW, height: PH, touchAction: 'none' }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={touchStart}
                onTouchMove={touchMove}
                onTouchEnd={() => setDragging(false)}
                onWheel={onWheel}
              />

              {/* Zoom controls */}
              <div className="w-full flex items-center gap-3">
                <ZoomOut size={14} className="text-white/30 flex-shrink-0" />
                <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={0.05}
                  value={zoom} onChange={onSlider}
                  className="flex-1 h-1 appearance-none bg-white/10 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 cursor-pointer" />
                <ZoomIn  size={14} className="text-white/30 flex-shrink-0" />
              </div>

              <p className="text-xs text-white/30 text-center">Drag to reposition · scroll or slider to zoom</p>

              {/* Change photo link */}
              <button type="button" onClick={pickFile}
                className="text-xs text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors">
                Choose a different photo
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 rounded-xl text-sm font-medium transition-all">
            Cancel
          </button>
          <button onClick={handleUpload} disabled={!src || uploading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-primary">
            {uploading ? <><Loader2 size={13} className="animate-spin" />Uploading…</> : <><Upload size={13} />Set Photo</>}
          </button>
        </div>

      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
};

export default ProfilePhotoModal;

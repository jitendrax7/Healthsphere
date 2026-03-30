export const calculateHospitalProfileCompletion = (hospital) => {

    let total = 0;
    let completed = 0;

    // Basic Info
    total += 2;

    if (hospital.hospitalName) completed++;
    if (hospital.registrationNumber) completed++;

    // Contact
    total += 2;

    if (hospital.contactNumber) completed++;
    if (hospital.email) completed++;

    // Location
    total += 5;

    if (hospital.location?.addressLine) completed++;
    if (hospital.location?.city) completed++;
    if (hospital.location?.state) completed++;
    if (hospital.location?.pincode) completed++;
    if (hospital.location?.latitude && hospital.location?.longitude) completed++;

    // Facilities
    total += 1;

    if (hospital.facilities?.length > 0) completed++;

    // Departments
    total += 1;

    if (hospital.departments?.length > 0) completed++;

    // Capacity
    total += 1;

    if (hospital.totalBeds) completed++;

    // Documents
    total += 1;

    if (hospital.documents?.length > 0) completed++;

    // Profile image
    total += 1;

    if (hospital.profileImage) completed++;

    // Calculate percentage
    const percentage = Math.round((completed / total) * 100);

    return percentage;

}
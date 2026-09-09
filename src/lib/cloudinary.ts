
const CLOUDINARY_CLOUD_NAME = "dzkdfwh1v";
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "klaro_unsigned";

export interface CloudinaryUploadResponse {
  success: boolean;
  secure_url?: string;
  public_id?: string;
  error?: string;
}

export async function uploadToCloudinary(
  fileData: string | Blob | File,
  folder: string = "klaro_inspections"
): Promise<CloudinaryUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", fileData);
    formData.append("folder", folder);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
      return {
        success: true,
        secure_url: data.secure_url,
        public_id: data.public_id,
      };
    }

    console.error("Cloudinary upload failed:", data.error?.message || "Unknown error");
    return {
      success: false,
      error: data.error?.message || "Cloudinary upload rejected",
    };
  } catch (err: any) {
    console.error("Cloudinary upload failed:", err);
    return {
      success: false,
      error: err?.message || "Network error uploading to Cloudinary",
    };
  }
}

import axios from "axios";
import { BaseUrl } from "./serverBaseUrl";

const uploadToS3 = async (file, folder) => {

  if (!file) return null;

  // setIsUploading(true);
  // setUploadProgress(0);
  try {
    const fileName = `${folder}/${file.name}`;
    const fileType = file.type
    const data = {
      fileName,
      fileType
    }
    const response = await axios.post('/api/upload', {
      headers: {
        'Content-Type': fileType,
      },
      data,
    });

    const { signedUrl } = await response.data;

    const uploadResponse = await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

   if(uploadResponse.status){

     return { imageUrl: fileName, fileType };
   }
return
  } finally {
    // setIsUploading(false);
  }
};

export const uploadImage = async (file, folder) => {
  const res = await uploadToS3(file, folder)
  if (res) {
    
 const { imageUrl, fileType } = res;
      const { data } = await axios.post(
        `${BaseUrl}/medias/create-media`,
        {
          src: imageUrl,
          path: "students",
          type: fileType
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'QWlpbGFicyBhcGkga2V5IGF0IGN5YmVyIHBhcmsgNHRoIGZsb29y'
          }
        }
      );
      const mediaId = data.media.id;
      return mediaId
  } else {
    throw new Error('Image upload failed');
  }

}
import { AxiosResponse } from "axios"
import { Response, handleResponse, catchError, api } from "@service/base"
import { WatermarkConfig } from "@src/types";

export async function UploadWatermark(file: File) {
    try {
      // Create FormData object and append the file to it
      const formData = new FormData();
      formData.append('content', file);
  
      // Make the API call with the FormData containing the file
      const res: Response<string> = await api
        .post<Response<string>>('/media/upload/watermark', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((e: AxiosResponse<Response<string>, string>) => handleResponse<Response<string>>(e))
        .catch(catchError);
  
      // Handle the response
      if (res.code !== 200) {
        console.log({ code: res.code, error_message: res.error_message });
        const err:Error =new Error(`${res.code}: ${res.error_message}`);
        throw err;
      }
  
      return res.data;
    } catch (error) {
      // Handle any unexpected errors during the process
      console.error('Unexpected error:', error);
      throw error;
    }
  }

export async function getID(){
  try{
    const res: Response<string> = await api
    .get<Response<string>>('/editor/fetch/id')
    .then((e: AxiosResponse<Response<string>, string>) => handleResponse<Response<string>>(e))
    .catch(catchError);

  // Handle the response
  if (res.code !== 200) {
    console.log({ code: res.code, error_message: res.error_message });
    const err:Error =new Error(`${res.code}: ${res.error_message}`);
    throw err;
  }

  return res.data;
}catch(error){
  console.error('Unexpected error:', error);
  throw error;
}
}

export const saveWatermarkConfig = async (data:WatermarkConfig) => {
  try{
    const res: Response<string> = await api
    .post<Response<string>>(`/editor/save`, {watermark:data})
    .then((e: AxiosResponse<Response<string>, string>) => handleResponse<Response<string>>(e))
    .catch(catchError);

  // Handle the response
  if (res.code >= 300) {
    console.log({ code: res.code, error_message: res.error_message });
    const err:Error =new Error(`${res.code}: ${res.error_message}`);
    throw err;
  }

  return res.data;
  } catch (error) {
  // Handle any unexpected errors during the process
  console.error('Unexpected error:', error);
  throw error;
  }
}

export const getWatermarkConfigByEventID = async (eventID:string) => {
  try{
    const res: Response<WatermarkConfig[]> = await api
    .get<Response<WatermarkConfig[]>>(`/editor/fetch?event_id=${eventID}`)
    .then( (e: AxiosResponse<Response<WatermarkConfig[]>,WatermarkConfig[]>) => 
      handleResponse<Response<WatermarkConfig[]>>(e)
    )
    // .catch((e)=>catchError(e as AxiosError<Response<string>>));

  // Handle the response
  if (res.code >= 300) {
    console.log({ code: res.code, error_message: res.error_message });
    const err:Error =new Error(`${res.code}: ${res.error_message}`);
    throw err;
  }

  return res.data;

  }catch (error) {
  // Handle any unexpected errors during the process
  console.error('Unexpected error:', error);
  throw error;
  }
}
  
  
  
  
  
  
export const encoder = (str) =>{
    const encodedBase64 = btoa(str);
    
    return encodedBase64
}
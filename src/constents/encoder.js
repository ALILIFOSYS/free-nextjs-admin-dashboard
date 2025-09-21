export const encoder = (str) =>{
    const encodedBase64 = btoa(str);
    console.log(encodedBase64);
    
    return encodedBase64
}
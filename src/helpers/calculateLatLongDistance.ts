
// function getDistanceFromLatLongKm(lat1,lon1, lat2,lon2) {
//     const R = 6371; // radius earth km
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);
//     const 
// }

// function deg2rad(deg: number){
//     return deg * (Math.PI/180);
// }

function distance(lat1: number, lon1: number, lat2: number, lon2:number) {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)) | 0;
}




export { distance };

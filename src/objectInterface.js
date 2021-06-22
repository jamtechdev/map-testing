// Modify Lat Long to suit x, y coordinates
export const objectModification = (item) => {
  item.Latitude = Number(String(item.Latitude).replace(/[^0-9.-]/g, ""));
  item.Longitude = Number(String(item.Longitude).replace(/[^0-9.-]/g, ""));
  if (item.Latitude > 0) {
    item.Latitude = -Math.abs(Number(item.Latitude));
  } else {
    item.Latitude = Math.abs(Number(item.Latitude));
  }
  return item;
};
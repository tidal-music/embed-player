export default function isOnMobileWithTouchScreen(
  userAgent = navigator.userAgent,
) {
  const iPad = /iPad/i.exec(userAgent);
  const iPhone = /iPhone/i.exec(userAgent);
  const Android = /Android/i.exec(userAgent);

  return Boolean(iPad || iPhone || Android);
}

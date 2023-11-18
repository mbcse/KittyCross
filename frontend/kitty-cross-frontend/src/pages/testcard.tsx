import KittyCard from "../components/Profile/KittyCard";
import KittyDetailed from "../components/Profile/KittyDetailed";

export default function test() {
  return (
    <>
      <KittyCard kittyId={234324} />
      <KittyDetailed kittyId={324234} />
    </>
  );
}

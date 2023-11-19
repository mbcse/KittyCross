import KittyCard from "../components/Profile/KittyCard";
import TaxiDriverStealsCatFailAlert from "../components/TaxiDriver/TaxiDriverStealsCat";
const kittydeets = {
  isGestating: false,
  isReady: true,
  cooldownIndex: "3", // Represented as a string
  nextActionAt: "1637260000", // Represented as a string
  siringWithId: "0", // Represented as a string
  birthTime: "1637250000", // Represented as a string
  matronId: "1", // Represented as a string
  sireId: "52", // Represented as a string
  generation: "1", // Represented as a string
  genes:
    "338635910126578066514989357798569375861404721347333941257145493487751203", // Represented as a string
};
export default function test() {
  return (
    <>
      <KittyCard clickable={true} chainId={84351} kittyId={"1223"} kitty={kittydeets} />
      <TaxiDriverStealsCatFailAlert />
    </>
  );
}

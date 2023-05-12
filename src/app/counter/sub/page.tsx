import { getCookie } from "../actions";

export default async function CounterPage() {
  console.log("Sub count :", await getCookie());
  return (
    <>
      <h1 className="text-4xl font-bold">Sub Count: {await getCookie()}</h1>
    </>
  );
}

import { getCookie } from "./actions";

export default async function CounterPage() {
  console.log("Home count :", await getCookie());
  return (
    <>
      <h1 className="text-4xl font-bold">Home Count: {await getCookie()}</h1>
    </>
  );
}

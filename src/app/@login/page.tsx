import { redirect } from "next/navigation";
import { setUser } from "./_actions";

async function login(formData: FormData) {
  "use server";
  const login = formData.get("login")?.toString();
  const password = formData.get("password")?.toString();

  if (login && password) {
    setUser({
      login,
      password,
    });
    redirect("/");
  }
}

export default function Page() {
  return (
    <>
      <h1>Login</h1>
      <form action={login}>
        <input type="text" name="login" required />
        <br />
        <input type="password" name="password" required />
        <br />
        <button>Login</button>
      </form>
    </>
  );
}

export default function LoginPage() {
  console.log("LOGIN PAGE");
  return (
    <div className="flex flex-col gap-4">
      <h2>Welcome to Todos by Next App Router.</h2>
      <p>
        A demo of&nbsp;
        <a
          href="https://nextjs.org/docs/app"
          className="text-indigo-500 underline"
          target="_blank"
        >
          Next App Router
        </a>
        &nbsp;with <strong>progressive enhancement</strong> using server
        actions, with persistent storage provided by&nbsp;
        <a
          href="https://vercel.com/docs/storage/vercel-kv"
          className="text-indigo-500 underline"
          target="_blank"
        >
          @vercel/kv
        </a>
        .
      </p>

      <hr />
      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
        No personal informations regarding your GitHub account are stored in
        database, your session is stored in your device cookies.
        <br />
        We store only the todos created linked with your GitHub ID.
      </p>
      <small className="text-sm text-gray-600 dark:text-gray-300 italic">
        Design shamefully copied by&nbsp;
        <a
          href="https://github.com/atinux/nuxt-todos-edge"
          className="text-indigo-500 underline"
          target="_blank"
        >
          https://github.com/atinux/nuxt-todos-edge
        </a>
      </small>
    </div>
  );
}

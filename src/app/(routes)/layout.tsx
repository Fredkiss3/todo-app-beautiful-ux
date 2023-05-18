import {
  authenticateWithGithub,
  destroySession,
  getSession,
} from "~/app/_actions/auth";

import ThemeToggle from "~/components/theme-toggle";
import { GithubIcon } from "~/components/ui/github-icon";
import { UserDropdown } from "~/components/user-dropdown";

export async function generateMetadata() {
  const user = await getSession();
  return {
    title: user ? `Todos for ${user.login}` : "The best todo app in the world",
  };
}

export default async function RootLayout({
  login,
  todo_app,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
  todo_app: React.ReactNode;
}) {
  const user = await getSession();
  return (
    <main className="p-8 flex flex-col items-center h-[100svh] justify-center gap-4">
      <div className="flex flex-col items-stretch gap-2 max-w-[500px] w-full">
        <ThemeToggle />
        <div className="overflow-hidden rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between px-4 py-5 sm:px-6">
            <h1 className="text-lg font-semibold leading-6">TODO APP</h1>

            {user ? (
              <UserDropdown {...user} logoutAction={destroySession} />
            ) : (
              <form action={authenticateWithGithub}>
                <button
                  rel="noopener noreferrer"
                  className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-1.5 shadow-sm text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 dark:disabled:bg-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>Login with GitHub</span>
                </button>
              </form>
            )}
          </div>
          <div className="px-4 py-5 sm:p-6">{user ? todo_app : login}</div>
        </div>
      </div>
      <footer className="w-full flex items-center justify-center gap-2 text-gray-400">
        <a
          href="https://github.com/Fredkiss3/todo-app-beautiful-ux"
          className="text-xs underline"
          target="_blank"
        >
          Github
        </a>
        &middot;
        <a
          href="https://twitter.com/fredkisss"
          target="_blank"
          className="text-xs  underline"
        >
          Twitter
        </a>
      </footer>
    </main>
  );
}

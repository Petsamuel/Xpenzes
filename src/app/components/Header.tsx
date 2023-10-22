import { UserAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, signInUser, signOutUser } = UserAuth();

  const handleSignIn = async () => {
    try {
      await signInUser();
    } catch (error) {}
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <div className="flex justify-center py-3 flex-col items-center gap-4">
      <nav className="flex justify-between w-full mx-4 shadow-md items-center py-2 px-6">
        <div className="brand  font-bold text-4xl mx-4 text-green-200">
          ⚔pense
        </div>
        {user ? (
          <div className="mx-4 flex justify-between items-center gap-4">
            <div className="flex text-sm items-center gap-3">
              <p className="hidden  lg:block"> Hello, {user.displayName}</p>
              <img
                src={user && user.photoURL}
                width={40}
                height={40}
                className="rounded-full"
                alt={"userProfile"}
              />
            </div>
            <div>
              <a
                href="#"
                onClick={() => {
                  handleSignOut();
                }}
                // className="p-1.5 px-5 bg-green-200 text-green-900 text-sm font-bold rounded-md flex items-center ring-2 ring-green-300/50 hover:bg-green-300 transition-all ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="currentColor"
                  className="bi bi-box-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                  />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div className="mx-4 flex justify-between items-center gap-4">
            <div>
              <a
                href="#"
                className="p-1.5 px-5 bg-gray-200 text-gray-900 text-sm font-bold rounded-md flex items-center ring-2 ring-gray-300/50 hover:bg-gray-300 transition-all ease-in-out"
                onClick={() => {
                  handleSignIn();
                }}
              >
                Login
              </a>
            </div>
            <div>
              <a
                href="#"
                onClick={() => {
                  handleSignIn();
                }}
                className="p-1.5 px-5 bg-green-200 text-green-900 text-sm font-bold rounded-md flex items-center ring-2 ring-green-300/50 hover:bg-green-300 transition-all ease-in-out"
              >
                Sign up
              </a>
            </div>
          </div>
        )}
      </nav>

      <h1 className="text-xl md:text-2xl lg:text-4xl font-bold leading-5 text-green-200 brand hidden">
        XPense Wise
      </h1>

      <div className="flex justify-between gap-4 py-4">
        <div className=""> </div>
        <div></div>
      </div>
    </div>
  );
};

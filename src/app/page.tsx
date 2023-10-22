"use client";
import React, { useState, useEffect } from "react";
import { DownloadButton } from "./components/Button";
import { AlertMessage } from "./components/AlertMessage";
import { UserAuth } from "./context/AuthContext";
import dynamic from "next/dynamic";

const html2PDF = dynamic(
  () =>
    import("jspdf-html2canvas").then(async (module) => {
      const jsPDF = module.default;
      const pdf = new (jsPDF as any)("p", "pt");
      return pdf;
    }),
  {
    ssr: false,
  }
) as React.FunctionComponent;

import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

// Define the Expense type
interface Expense {
  title: string;
  price: number;
}

export default function Home() {
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState({ title: "", price: "" });
  const [list, setList] = useState([{ title: "", price: 0 }]);
  const { date, user } = UserAuth();
  const [alert, setAlert] = useState<{
    message: string;
    status: number;
  }>();

  // global decleartion

  // function to calculate total
  const CalculateTotal = (expense: any[]) => {
    const total = expense.reduce((acct, curr) => acct + Number(curr.price), 0);
    setTotal(total);
  };
  // Add items to database

  const addItem = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (!user) {
      await setDoc(doc(db, "expenses", value.title), value);
    } else {
      // Use the user's UID in the collection path
      const { uid } = user;
      const collectionPath = `users/${uid}/expenses`;
      await setDoc(doc(db, collectionPath, value.title), value);
      setValue({ title: "", price: "" });
    }
  };

  useEffect(() => {
    // read items for specific user
    const UserView = async () => {
      if (user) {
        const { uid } = user;
        const collectionPath = `users/${uid}/expenses`;
        const q = query(collection(db, collectionPath));

        try {
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const expense: Expense[] = [];
            snapshot.forEach((doc) => {
              expense.push({
                title: doc.data().title,
                price: doc.data().price,
              });
            });
            setList(expense);
            // Calculate the total

            CalculateTotal(expense);
          });

          // Return the unsubscribe function to stop listening when the component unmounts
          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle the error,
        }
      } else {
        const unSubscribe = onSnapshot(
          collection(db, "expenses"),
          (QuerySnapshot) => {
            const expense: Expense[] = [];
            QuerySnapshot.forEach((doc) => {
              expense.push({
                title: doc.data().title,
                price: doc.data().price,
              });
            });

            setList(expense);
            // Calculate the total
            {
              CalculateTotal(expense);
            }
            return () => unSubscribe();
          }
        );
      }
    };

    UserView();
  }, [user]);

  const removeItem = async (value: string) => {
    if (user) {
      // Use the user's UID in the collection path
      const { uid } = user;
      const collectionPath = `users/${uid}/expenses`;
      await deleteDoc(doc(db, collectionPath, value));
      // Item deleted successfully for authenticated users
    } else {
      // setInterval

      // Set the error message
      setAlert({ message: "Please login to continue", status: 403 });
      // Set the timer to clear the error message
      const timer = setTimeout(() => {
        setAlert({ message: "", status: 0 }); // Clear the error message
      }, 3000);

      // Cleanup function to clear the timer when the component unmounts
      return () => {
        clearTimeout(timer);
      };

      // Uncomment the next line if you want unauthenticated users to delete items from the shared collection
      // await deleteDoc(doc(db, "expenses", value);
    }
  };

  //  downloadFile
  const DownloadFile = () => {
    const page = document.getElementById("page");

    if (page) {
      html2PDF(page, {
        jsPDF: {
          format: "a4",
        },
        imageType: "image/jpeg",
        output: "https://xpenzes.vercel.app/Xpenze.pdf",
      });
      setAlert({ message: "File downloaded", status: 200 });
      const timer = setTimeout(() => {
        setAlert({ message: "", status: 0 });
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setAlert({ message: "No PDF file to download", status: 400 });

      const timer = setTimeout(() => {
        setAlert({ message: "", status: 0 });
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
  };
  // prevent screenshot
  // document.oncontextmenu = function () {
  //   return false;
  // };
  // document.onkeydown = function (e) {
  //   if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
  //     e.preventDefault();
  //   }
  // };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between mx-6">
        <div className="">
          <form className=" flex items-center justify-around gap-5">
            <div className="flex flex-col items-start">
              <input
                className="p-3 rounded-sm border-b-2 border-green-200 bg-transparent w-full sm:w-11/12 md:w-10/12 lg:w-full text-xl sm:text-3xl md:text-xl lg:text-2xl 2xl:text-3xl outline-none focus:border-green-300 focus:border-b-4 inline"
                type="text"
                name="title"
                value={value.title}
                placeholder="Expense title"
                onChange={(e) => {
                  setValue({ ...value, title: e.target.value });
                }}
              />
            </div>
            <div className="flex flex-col ">
              <input
                className="p-3 rounded-sm border-b-2 border-green-200 bg-transparent w-full sm:w-11/12 md:w-10/12 lg:w-full text-xl sm:text-3xl md:text-xl lg:text-2xl 2xl:text-3xl outline-none focus:border-green-300 focus:border-b-4 inline"
                type="number"
                name="price"
                placeholder="Expense price"
                value={value.price}
                onChange={(e) => {
                  setValue({ ...value, price: e.target.value });
                }}
              />
            </div>
            <div className="flex mt-6 -ml-2">
              <a
                type="submit"
                className="cursor-pointer  rounded-md text-sm"
                onClick={(event) => addItem(event)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
              </a>
            </div>
          </form>
          {/* Table ext */}
          {list.length !== 0 && (
            <div id="page" className="relative">
              <div className="pt-5 text-sm text-right w-full">
                {date && (
                  <>Date: {`${date?.day}/${date?.month}/${date?.year}`}</>
                )}
              </div>
              <table className="min-w-full bg-[#262534] mt-6  table-fixed">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-md text-left lg:text-xl font-medium  capitalize tracking-wider">
                      Expense
                    </th>
                    <th className="px-6 py-3 text-md text-left lg:text-xl font-medium capitalize tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((value, id) => (
                    <tr
                      className="border-t border-gray-300 font-[Poppins] cursor-pointer hover:bg-slate-900 transition-all ease-in-out hover:shadow-lg "
                      key={id}
                    >
                      <td className="px-6 py-4 whitespace-no-wrap ">
                        {value.title}
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap">
                        {value.price}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          onClick={() => {
                            removeItem(value.title);
                          }}
                          className="cursor-pointer flex justify-center items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="#f59e0b"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                          </svg>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between py-5 bg-green-200 px-6 text-green-900 hover:bg-green-300 transition-all ease-in-out hover:shadow-lg w-full">
                <span>Total:</span>
                <span>${total}</span>
              </div>

              {/* download button */}
            </div>
          )}
          {list.length != 0 && user && (
            <DownloadButton handleEvent={DownloadFile} />
          )}
        </div>

        {/*  */}
        <div className="fixed bottom-6 right-4 flex space-y-2 flex-col gap-4 items-center">
          <div className="" title="Visit Github">
            <a href="https://github.com/Petsamuel/Xpenzes">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-lg text-gray2 hover:text-black1 dark:hover:text-white cursor-pointer"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
          <div className="" title="Support Us">
            <a href="https://www.buymeacoffee.com/Bieefilled">
              {" "}
              <svg
                viewBox="0 0 884 1279"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[1.5em] cursor-pointer"
              >
                <path
                  d="M791.109 297.518L790.231 297.002L788.201 296.383C789.018 297.072 790.04 297.472 791.109 297.518V297.518Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M803.896 388.891L802.916 389.166L803.896 388.891Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M791.484 297.377C791.359 297.361 791.237 297.332 791.118 297.29C791.111 297.371 791.111 297.453 791.118 297.534C791.252 297.516 791.379 297.462 791.484 297.377V297.377Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M791.113 297.529H791.244V297.447L791.113 297.529Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M803.111 388.726L804.591 387.883L805.142 387.573L805.641 387.04C804.702 387.444 803.846 388.016 803.111 388.726V388.726Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M793.669 299.515L792.223 298.138L791.243 297.605C791.77 298.535 792.641 299.221 793.669 299.515V299.515Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M430.019 1186.18C428.864 1186.68 427.852 1187.46 427.076 1188.45L427.988 1187.87C428.608 1187.3 429.485 1186.63 430.019 1186.18Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M641.187 1144.63C641.187 1143.33 640.551 1143.57 640.705 1148.21C640.705 1147.84 640.86 1147.46 640.929 1147.1C641.015 1146.27 641.084 1145.46 641.187 1144.63Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M619.284 1186.18C618.129 1186.68 617.118 1187.46 616.342 1188.45L617.254 1187.87C617.873 1187.3 618.751 1186.63 619.284 1186.18Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M281.304 1196.06C280.427 1195.3 279.354 1194.8 278.207 1194.61C279.136 1195.06 280.065 1195.51 280.684 1195.85L281.304 1196.06Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M247.841 1164.01C247.704 1162.66 247.288 1161.35 246.619 1160.16C247.093 1161.39 247.489 1162.66 247.806 1163.94L247.841 1164.01Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M472.623 590.836C426.682 610.503 374.546 632.802 306.976 632.802C278.71 632.746 250.58 628.868 223.353 621.274L270.086 1101.08C271.74 1121.13 280.876 1139.83 295.679 1153.46C310.482 1167.09 329.87 1174.65 349.992 1174.65C349.992 1174.65 416.254 1178.09 438.365 1178.09C462.161 1178.09 533.516 1174.65 533.516 1174.65C553.636 1174.65 573.019 1167.08 587.819 1153.45C602.619 1139.82 611.752 1121.13 613.406 1101.08L663.459 570.876C641.091 563.237 618.516 558.161 593.068 558.161C549.054 558.144 513.591 573.303 472.623 590.836Z"
                  fill="#FFDD00"
                ></path>
                <path
                  d="M78.6885 386.132L79.4799 386.872L79.9962 387.182C79.5987 386.787 79.1603 386.435 78.6885 386.132V386.132Z"
                  fill="#e4e4e7"
                ></path>
                <path
                  d="M879.567 341.849L872.53 306.352C866.215 274.503 851.882 244.409 819.19 232.898C808.711 229.215 796.821 227.633 788.786 220.01C780.751 212.388 778.376 200.55 776.518 189.572C773.076 169.423 769.842 149.257 766.314 129.143C763.269 111.85 760.86 92.4243 752.928 76.56C742.604 55.2584 721.182 42.8009 699.88 34.559C688.965 30.4844 677.826 27.0375 666.517 24.2352C613.297 10.1947 557.342 5.03277 502.591 2.09047C436.875 -1.53577 370.983 -0.443234 305.422 5.35968C256.625 9.79894 205.229 15.1674 158.858 32.0469C141.91 38.224 124.445 45.6399 111.558 58.7341C95.7448 74.8221 90.5829 99.7026 102.128 119.765C110.336 134.012 124.239 144.078 138.985 150.737C158.192 159.317 178.251 165.846 198.829 170.215C256.126 182.879 315.471 187.851 374.007 189.968C438.887 192.586 503.87 190.464 568.44 183.618C584.408 181.863 600.347 179.758 616.257 177.304C634.995 174.43 647.022 149.928 641.499 132.859C634.891 112.453 617.134 104.538 597.055 107.618C594.095 108.082 591.153 108.512 588.193 108.942L586.06 109.252C579.257 110.113 572.455 110.915 565.653 111.661C551.601 113.175 537.515 114.414 523.394 115.378C491.768 117.58 460.057 118.595 428.363 118.647C397.219 118.647 366.058 117.769 334.983 115.722C320.805 114.793 306.661 113.611 292.552 112.177C286.134 111.506 279.733 110.801 273.333 110.009L267.241 109.235L265.917 109.046L259.602 108.134C246.697 106.189 233.792 103.953 221.025 101.251C219.737 100.965 218.584 100.249 217.758 99.2193C216.932 98.1901 216.482 96.9099 216.482 95.5903C216.482 94.2706 216.932 92.9904 217.758 91.9612C218.584 90.9319 219.737 90.2152 221.025 89.9293H221.266C232.33 87.5721 243.479 85.5589 254.663 83.8038C258.392 83.2188 262.131 82.6453 265.882 82.0832H265.985C272.988 81.6186 280.026 80.3625 286.994 79.5366C347.624 73.2302 408.614 71.0801 469.538 73.1014C499.115 73.9618 528.676 75.6996 558.116 78.6935C564.448 79.3474 570.746 80.0357 577.043 80.8099C579.452 81.1025 581.878 81.4465 584.305 81.7391L589.191 82.4445C603.438 84.5667 617.61 87.1419 631.708 90.1703C652.597 94.7128 679.422 96.1925 688.713 119.077C691.673 126.338 693.015 134.408 694.649 142.03L696.731 151.752C696.786 151.926 696.826 152.105 696.852 152.285C701.773 175.227 706.7 198.169 711.632 221.111C711.994 222.806 712.002 224.557 711.657 226.255C711.312 227.954 710.621 229.562 709.626 230.982C708.632 232.401 707.355 233.6 705.877 234.504C704.398 235.408 702.75 235.997 701.033 236.236H700.895L697.884 236.649L694.908 237.044C685.478 238.272 676.038 239.419 666.586 240.486C647.968 242.608 629.322 244.443 610.648 245.992C573.539 249.077 536.356 251.102 499.098 252.066C480.114 252.57 461.135 252.806 442.162 252.771C366.643 252.712 291.189 248.322 216.173 239.625C208.051 238.662 199.93 237.629 191.808 236.58C198.106 237.389 187.231 235.96 185.029 235.651C179.867 234.928 174.705 234.177 169.543 233.397C152.216 230.798 134.993 227.598 117.7 224.793C96.7944 221.352 76.8005 223.073 57.8906 233.397C42.3685 241.891 29.8055 254.916 21.8776 270.735C13.7217 287.597 11.2956 305.956 7.64786 324.075C4.00009 342.193 -1.67805 361.688 0.472751 380.288C5.10128 420.431 33.165 453.054 73.5313 460.35C111.506 467.232 149.687 472.807 187.971 477.556C338.361 495.975 490.294 498.178 641.155 484.129C653.44 482.982 665.708 481.732 677.959 480.378C681.786 479.958 685.658 480.398 689.292 481.668C692.926 482.938 696.23 485.005 698.962 487.717C701.694 490.429 703.784 493.718 705.08 497.342C706.377 500.967 706.846 504.836 706.453 508.665L702.633 545.797C694.936 620.828 687.239 695.854 679.542 770.874C671.513 849.657 663.431 928.434 655.298 1007.2C653.004 1029.39 650.71 1051.57 648.416 1073.74C646.213 1095.58 645.904 1118.1 641.757 1139.68C635.218 1173.61 612.248 1194.45 578.73 1202.07C548.022 1209.06 516.652 1212.73 485.161 1213.01C450.249 1213.2 415.355 1211.65 380.443 1211.84C343.173 1212.05 297.525 1208.61 268.756 1180.87C243.479 1156.51 239.986 1118.36 236.545 1085.37C231.957 1041.7 227.409 998.039 222.9 954.381L197.607 711.615L181.244 554.538C180.968 551.94 180.693 549.376 180.435 546.76C178.473 528.023 165.207 509.681 144.301 510.627C126.407 511.418 106.069 526.629 108.168 546.76L120.298 663.214L145.385 904.104C152.532 972.528 159.661 1040.96 166.773 1109.41C168.15 1122.52 169.44 1135.67 170.885 1148.78C178.749 1220.43 233.465 1259.04 301.224 1269.91C340.799 1276.28 381.337 1277.59 421.497 1278.24C472.979 1279.07 524.977 1281.05 575.615 1271.72C650.653 1257.95 706.952 1207.85 714.987 1130.13C717.282 1107.69 719.576 1085.25 721.87 1062.8C729.498 988.559 737.115 914.313 744.72 840.061L769.601 597.451L781.009 486.263C781.577 480.749 783.905 475.565 787.649 471.478C791.392 467.391 796.352 464.617 801.794 463.567C823.25 459.386 843.761 452.245 859.023 435.916C883.318 409.918 888.153 376.021 879.567 341.849ZM72.4301 365.835C72.757 365.68 72.1548 368.484 71.8967 369.792C71.8451 367.813 71.9483 366.058 72.4301 365.835ZM74.5121 381.94C74.6842 381.819 75.2003 382.508 75.7337 383.334C74.925 382.576 74.4089 382.009 74.4949 381.94H74.5121ZM76.5597 384.641C77.2996 385.897 77.6953 386.689 76.5597 384.641V384.641ZM80.672 387.979H80.7752C80.7752 388.1 80.9645 388.22 81.0333 388.341C80.9192 388.208 80.7925 388.087 80.6548 387.979H80.672ZM800.796 382.989C793.088 390.319 781.473 393.726 769.996 395.43C641.292 414.529 510.713 424.199 380.597 419.932C287.476 416.749 195.336 406.407 103.144 393.382C94.1102 392.109 84.3197 390.457 78.1082 383.798C66.4078 371.237 72.1548 345.944 75.2003 330.768C77.9878 316.865 83.3218 298.334 99.8572 296.355C125.667 293.327 155.64 304.218 181.175 308.09C211.917 312.781 242.774 316.538 273.745 319.36C405.925 331.405 540.325 329.529 671.92 311.91C695.905 308.686 719.805 304.941 743.619 300.674C764.835 296.871 788.356 289.731 801.175 311.703C809.967 326.673 811.137 346.701 809.778 363.615C809.359 370.984 806.139 377.915 800.779 382.989H800.796Z"
                  fill="#e4e4e7"
                ></path>
              </svg>
            </a>
          </div>
        </div>
        {/* alertMessage */}
        <div className={alert?.status == 0 ? "hidden" : "block"}>
          {alert?.message && <AlertMessage message={alert} />}
        </div>
      </main>
    </>
  );
}

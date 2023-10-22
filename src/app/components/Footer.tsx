import { UserAuth } from "../context/AuthContext";

export const Footer = () => {
  const { date } = UserAuth();
  return (
    <div className="flex justify-center">
      <p>&copy;{date?.year} Bieefilled</p>
    </div>
  );
};

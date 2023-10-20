export const Footer = () => {
  const DateYear = () => {
    const date = new Date();
    const year = date.getFullYear().toString(); // Added parentheses to call function
    return year;
  };

  return (
    <div className="flex justify-center">
      <p>&copy;{DateYear()} Bieefilled</p>
    </div>
  );
};

// src/components/PageTitle.js
import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  const baseTitle = "Recipe Haven";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
};

export default PageTitle;

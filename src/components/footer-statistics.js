export const createFooterStatisticsTemplate = (count) => {
  return (
    `<section class="footer__statistics">
      <p>${count.toLocaleString(`ru`)} movies inside</p>
    </section>`
  );
};

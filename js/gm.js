(async function () {
  "use strict";
  const P = window.TariqPosts;
  const container = document.getElementById("posts");
  try {
    const posts = (await P.load()).filter(post => post.brand === "GM" && post.type === "guides");
    if (!posts.length) {
      P.status(container, "لا توجد مواضيع GM حاليًا.");
      return;
    }
    const cards = posts.map(post => {
      const card = P.element("article", "card");
      const image = P.image(post);
      if (image) card.append(image);
      const content = P.element("div", "card-content");
      const link = P.element("a", "button", "اقرأ الموضوع");
      link.href = "post.html?id=" + encodeURIComponent(post.id);
      content.append(P.element("span", "category", P.category(post)),
        P.element("h3", "", post.title), P.element("p", "", post.summary), link);
      card.append(content);
      return card;
    });
    container.replaceChildren(...cards);
  } catch {
    P.status(container, "تعذر تحميل المواضيع. تحقق من الاتصال ثم أعد المحاولة.", true);
  } finally {
    container.setAttribute("aria-busy", "false");
  }
}());

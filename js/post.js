(async function () {
  "use strict";
  const P = window.TariqPosts;
  const container = document.getElementById("post");
  const id = new URLSearchParams(location.search).get("id");
  try {
    if (!id || !id.trim()) {
      document.title = "رابط الموضوع غير مكتمل | Tariq Tuner";
      P.status(container, "لم يتم تحديد الموضوع. اختر موضوعًا من صفحة GM.");
      return;
    }
    const post = (await P.load()).find(item => String(item.id) === id);
    if (!post) {
      document.title = "الموضوع غير موجود | Tariq Tuner";
      P.status(container, "الموضوع غير موجود. قد يكون الرابط غير صحيح أو تم حذف الموضوع.");
      return;
    }
    document.title = post.title + " | Tariq Tuner";
    const article = P.element("article", "post-card");
    article.append(P.element("span", "category", [P.text(post.brand), P.category(post)].filter(Boolean).join(" • ")),
      P.element("h1", "post-title", post.title));
    if (P.text(post.summary).trim()) article.append(P.element("p", "post-summary", post.summary));
    const image = P.image(post, "post-image");
    if (image) article.append(image);
    article.append(P.element("div", "post-content", P.text(post.content).trim() ? post.content : "لم يُضف شرح لهذا الموضوع بعد."));
    const externalURL = P.safeURL(post.link);
    if (externalURL) {
      const link = P.element("a", "button post-link", "فتح الرابط المرفق ↗");
      link.href = externalURL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      article.append(link);
    }
    container.replaceChildren(article);
  } catch {
    P.status(container, "تعذر تحميل الموضوع. تحقق من الاتصال ثم أعد المحاولة.", true);
  } finally {
    container.setAttribute("aria-busy", "false");
  }
}());

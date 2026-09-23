(function () {
  "use strict";

  const categoryNames = {
    engine: "برمجة المحرك",
    transmission: "برمجة القير",
    cooling: "المراوح والحرارة",
    diagnostics: "الأعطال والتشخيص",
    experience: "تجارب وتعديلات",
    tool: "أدوات",
    software: "برامج",
    product: "منتجات"
  };

  function text(value) {
    return typeof value === "string" ? value : "";
  }

  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = text(value);
    return node;
  }

  // Relative image paths resolve beside the public HTML pages, including project Pages sites.
  function safeURL(value, allowRelative = false) {
    const raw = text(value).trim();
    if (!raw || /[\u0000-\u001f\u007f\\]/.test(raw) || raw.startsWith("//")) return "";
    if (!allowRelative && !/^https?:\/\//i.test(raw)) return "";
    try {
      const url = new URL(raw, document.baseURI);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return "";
      return url.href;
    } catch {
      return "";
    }
  }

  async function load() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("data/posts.json", { cache: "no-cache", signal: controller.signal });
      if (!response.ok) throw new Error("تعذر تحميل ملف المواضيع");
      const posts = await response.json();
      const ids = new Set();
      if (!Array.isArray(posts)) throw new Error("صيغة ملف المواضيع غير صحيحة");
      for (const post of posts) {
        const validId = post && ((typeof post.id === "string" && post.id.trim()) ||
          (typeof post.id === "number" && Number.isFinite(post.id)));
        if (!validId || !text(post.title).trim() || ids.has(String(post.id))) {
          throw new Error("بيانات أحد المواضيع غير صحيحة أو معرفه مكرر");
        }
        ids.add(String(post.id));
      }
      return posts;
    } finally {
      clearTimeout(timeout);
    }
  }

  function category(post) {
    return Object.hasOwn(categoryNames, post.category) ? categoryNames[post.category] :
      text(post.category) || text(post.brand) || "موضوع";
  }

  function image(post, className) {
    const url = safeURL(post.image, true);
    if (!url) return null;
    const img = element("img", className);
    img.alt = text(post.title);
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.replaceWith(element("p", "image-unavailable", "الصورة غير متاحة حاليًا."));
    }, { once: true });
    img.src = url;
    return img;
  }

  function status(container, message, retry = false) {
    const box = element("div", "empty");
    box.append(element("p", "", message));
    if (retry) {
      const link = element("a", "button", "إعادة المحاولة");
      link.href = location.href;
      box.append(link);
    }
    container.replaceChildren(box);
  }

  window.TariqPosts = { load, text, element, safeURL, category, image, status };
}());

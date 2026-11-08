// The four page ranges match the original Figma artboards in the supplied portfolio PDF.
const projects = {
  cloudtune: { title: "云朵音乐 CloudTune", start: 4, end: 17 },
  robot: { title: "科大讯飞 · 家庭陪伴机器人", start: 18, end: 32 },
  wander: { title: "海途 · Wander", start: 33, end: 56 },
  trees: { title: "树木的 N 种打开方式", start: 57, end: 75 },
  dtpark: { title: "代停 · DT Park", start: 57, end: 64, prefix: "dtpark-" }
};

const slug = new URLSearchParams(location.search).get("project");
const project = projects[slug];
const root = document.querySelector("#case-content");

if (!project) {
  const message = document.createElement("p");
  message.className = "project-empty";
  message.textContent = "未找到该项目，请返回作品集选择项目。";
  root.append(message);
} else {
  document.title = `${project.title} — 邢甲一 Xing Jiayi`;
  const heading = document.createElement("h1");
  heading.className = "original-project-title";
  heading.textContent = project.title;
  root.append(heading);

  if (project.start) {
    const gallery = document.createElement("div");
    gallery.className = "original-pages";
    gallery.setAttribute("aria-label", `${project.title} Figma 原稿页面`);
    for (let page = project.start; page <= project.end; page++) {
      const imagePath = project.prefix
        ? `assets/figma-pages/${project.prefix}${page}.jpg`
        : `assets/figma-pages/page-${String(page).padStart(2, "0")}.jpg`;
      const link = document.createElement("a");
      link.href = imagePath;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", `放大查看${project.title}第 ${page - project.start + 1} 页`);
      const image = document.createElement("img");
      image.src = imagePath;
      image.alt = `${project.title} 原稿第 ${page - project.start + 1} 页`;
      image.loading = page === project.start ? "eager" : "lazy";
      image.decoding = "async";
      image.width = 1920;
      image.height = 1080;
      link.append(image);
      gallery.append(link);
    }
    root.append(gallery);
  }

  if (slug === "wander") {
    const video = document.createElement("video");
    video.className = "original-project-video";
    video.controls = true;
    video.playsInline = true;
    video.preload = "none";
    video.poster = "assets/wander-hmi.png";
    video.setAttribute("aria-label", "海途 · Wander 项目展示视频");
    const source = document.createElement("source");
    source.src = "assets/wander-showcase.mp4";
    source.type = "video/mp4";
    video.append(source);
    const fallback = document.createElement("a");
    fallback.href = source.src;
    fallback.textContent = "下载海途 · Wander 项目展示视频";
    video.append(fallback);
    root.append(video);
  }
}

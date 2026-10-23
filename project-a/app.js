// 最小示例：演示子路径下的独立 JS 能正常加载（证明 ./ 相对路径有效）
let n = 0;
document.getElementById("btn").addEventListener("click", () => {
  n += 1;
  document.getElementById("count").textContent = n;
});

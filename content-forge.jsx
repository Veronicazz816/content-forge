import { useState, useEffect, useRef } from "react";

const PLATFORMS = [
  { id: "xiaohongshu", name: "小红书", icon: "📕", color: "#FF2442" },
  { id: "wechat", name: "公众号", icon: "💬", color: "#07C160" },
  { id: "zhihu", name: "知乎", icon: "💡", color: "#0066FF" },
  { id: "twitter", name: "X/Twitter", icon: "🐦", color: "#1DA1F2" },
];

const CONTENT_TYPES = [
  { id: "article", name: "长文", desc: "深度文章/教程" },
  { id: "short", name: "短文", desc: "社交媒体帖子" },
  { id: "thread", name: "推文串", desc: "连续推文" },
  { id: "summary", name: "摘要", desc: "信息提炼" },
];

const MOCK_HISTORY = [
  { id: 1, title: "AI Agent 开发实战指南", platform: "zhihu", type: "article", tokens: 4200, time: "2026-04-30 14:22", status: "published" },
  { id: 2, title: "Claude Code 高效使用技巧", platform: "xiaohongshu", type: "short", tokens: 1800, time: "2026-04-30 10:15", status: "published" },
  { id: 3, title: "MiMo V2.5 模型体验报告", platform: "wechat", type: "article", tokens: 5600, time: "2026-04-29 20:30", status: "published" },
  { id: 4, title: "开源模型选型对比分析", platform: "zhihu", type: "article", tokens: 6100, time: "2026-04-29 16:45", status: "published" },
  { id: 5, title: "Prompt Engineering Best Practices", platform: "twitter", type: "thread", tokens: 2400, time: "2026-04-28 22:10", status: "published" },
  { id: 6, title: "自动化工作流搭建心得", platform: "xiaohongshu", type: "short", tokens: 1500, time: "2026-04-28 18:30", status: "published" },
  { id: 7, title: "LLM 应用架构设计模式", platform: "wechat", type: "article", tokens: 7200, time: "2026-04-27 14:00", status: "published" },
  { id: 8, title: "Token 成本优化策略", platform: "zhihu", type: "article", tokens: 3800, time: "2026-04-27 09:20", status: "draft" },
];

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const step = (ts) => {
      if (!ref.current) ref.current = ts;
      const p = Math.min((ts - ref.current) / duration, 1);
      setDisplay(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    ref.current = null;
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

function StatCard({ label, value, unit, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "20px 24px",
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8, letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent || "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
        <AnimatedNumber value={value} /> <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>{unit}</span>
      </div>
    </div>
  );
}

export default function ContentForge() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalTokens = MOCK_HISTORY.reduce((s, h) => s + h.tokens, 0);
  const totalPosts = MOCK_HISTORY.length;
  const publishedPosts = MOCK_HISTORY.filter(h => h.status === "published").length;

  const handleGenerate = () => {
    if (!topic || !selectedPlatform || !selectedType) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const platform = PLATFORMS.find(p => p.id === selectedPlatform);
      const type = CONTENT_TYPES.find(t => t.id === selectedType);
      setGenerated({
        title: topic,
        platform: platform.name,
        type: type.name,
        content: generateMockContent(topic, selectedPlatform, selectedType),
        tokens: Math.floor(Math.random() * 4000) + 1500,
      });
    }, 2500);
  };

  const handlePublish = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setGenerated(null);
      setTopic("");
      setSelectedPlatform(null);
      setSelectedType(null);
    }, 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#fff",
      fontFamily: "'Noto Sans SC', 'SF Pro Display', -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background gradient orbs */}
      <div style={{
        position: "fixed", top: -200, right: -200, width: 600, height: 600,
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: -300, left: -100, width: 800, height: 800,
        background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <header style={{
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800,
          }}>C</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.5 }}>ContentForge</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>AI 内容创作工作流</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4 }}>
          {[
            { id: "dashboard", label: "数据看板" },
            { id: "create", label: "创作中心" },
            { id: "history", label: "发布记录" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                background: activeTab === tab.id ? "rgba(99,102,241,0.2)" : "transparent",
                color: activeTab === tab.id ? "#a5b4fc" : "rgba(255,255,255,0.45)",
              }}
            >{tab.label}</button>
          ))}
        </div>
      </header>

      <main style={{ padding: "32px", maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 10 }}>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, letterSpacing: -0.5 }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>/ </span>数据总览
            </h2>
            <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
              <StatCard label="TOKEN 消耗" value={totalTokens} unit="tokens" accent="#a5b4fc" />
              <StatCard label="内容产出" value={totalPosts} unit="篇" accent="#34d399" />
              <StatCard label="已发布" value={publishedPosts} unit="篇" accent="#fbbf24" />
              <StatCard label="日均产出" value={Math.round(totalPosts / 4)} unit="篇/天" accent="#f472b6" />
            </div>

            {/* Platform distribution */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: 24, marginBottom: 24,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>平台分布</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {PLATFORMS.map(p => {
                  const count = MOCK_HISTORY.filter(h => h.platform === p.id).length;
                  const pct = Math.round((count / totalPosts) * 100);
                  return (
                    <div key={p.id} style={{
                      flex: 1, minWidth: 120, padding: "16px",
                      background: "rgba(255,255,255,0.03)", borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{count} 篇 · {pct}%</div>
                      <div style={{
                        marginTop: 8, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden",
                      }}>
                        <div style={{
                          width: `${pct}%`, height: "100%", background: p.color,
                          borderRadius: 2, transition: "width 1s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Token usage chart (simplified bar chart) */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: 24,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>近 7 天 Token 消耗趋势</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {[3200, 5600, 4100, 7800, 6200, 8400, 5200].map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{(v / 1000).toFixed(1)}k</div>
                    <div style={{
                      width: "100%", maxWidth: 48,
                      height: `${(v / 8400) * 100}%`,
                      background: `linear-gradient(180deg, rgba(99,102,241,0.6) 0%, rgba(99,102,241,0.15) 100%)`,
                      borderRadius: "6px 6px 2px 2px",
                      transition: "height 0.8s ease",
                      minHeight: 4,
                    }} />
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{["4/26","4/27","4/28","4/29","4/30","5/1","5/2"][i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Tab */}
        {activeTab === "create" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, letterSpacing: -0.5 }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>/ </span>内容创作
            </h2>

            {!generated ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Platform select */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block", color: "rgba(255,255,255,0.7)" }}>
                    选择发布平台
                  </label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlatform(p.id)}
                        style={{
                          padding: "14px 24px", borderRadius: 14, border: "1px solid",
                          borderColor: selectedPlatform === p.id ? p.color : "rgba(255,255,255,0.08)",
                          background: selectedPlatform === p.id ? `${p.color}15` : "rgba(255,255,255,0.03)",
                          color: selectedPlatform === p.id ? "#fff" : "rgba(255,255,255,0.5)",
                          cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8,
                          transition: "all 0.2s",
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{p.icon}</span> {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content type */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block", color: "rgba(255,255,255,0.7)" }}>
                    内容类型
                  </label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {CONTENT_TYPES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        style={{
                          padding: "12px 20px", borderRadius: 12, border: "1px solid",
                          borderColor: selectedType === t.id ? "#6366f1" : "rgba(255,255,255,0.08)",
                          background: selectedType === t.id ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                          color: selectedType === t.id ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                          cursor: "pointer", fontSize: 13, textAlign: "left",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.name}</div>
                        <div style={{ fontSize: 11, opacity: 0.6 }}>{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic input */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block", color: "rgba(255,255,255,0.7)" }}>
                    主题 / 关键词
                  </label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="输入你想创作的主题，如：MiMo V2.5 模型使用体验..."
                    style={{
                      width: "100%", padding: "14px 18px", borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)", color: "#fff",
                      fontSize: 14, outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={!topic || !selectedPlatform || !selectedType || generating}
                  style={{
                    padding: "16px 32px", borderRadius: 14, border: "none",
                    background: (!topic || !selectedPlatform || !selectedType)
                      ? "rgba(255,255,255,0.06)"
                      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: (!topic || !selectedPlatform || !selectedType) ? "rgba(255,255,255,0.2)" : "#fff",
                    fontSize: 15, fontWeight: 700, cursor: "pointer",
                    transition: "all 0.3s", alignSelf: "flex-start",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {generating ? (
                    <>
                      <span style={{
                        width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff", borderRadius: "50%",
                        animation: "spin 0.8s linear infinite", display: "inline-block",
                      }} />
                      AI 生成中...
                    </>
                  ) : "✨ 开始生成"}
                </button>
              </div>
            ) : (
              /* Generated content preview */
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20, padding: 28, animation: "fadeIn 0.5s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
                      {generated.platform} · {generated.type} · {generated.tokens.toLocaleString()} tokens
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{generated.title}</div>
                  </div>
                  <div style={{
                    padding: "6px 14px", borderRadius: 20,
                    background: "rgba(52,211,153,0.12)", color: "#34d399",
                    fontSize: 12, fontWeight: 600,
                  }}>已生成</div>
                </div>
                <div style={{
                  padding: 20, background: "rgba(0,0,0,0.3)", borderRadius: 14,
                  fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.75)",
                  whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto",
                  marginBottom: 20,
                }}>
                  {generated.content}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handlePublish} style={{
                    padding: "12px 28px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg, #34d399, #059669)",
                    color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}>
                    📤 发布
                  </button>
                  <button onClick={() => { setGenerated(null); }} style={{
                    padding: "12px 28px", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent", color: "rgba(255,255,255,0.5)",
                    fontSize: 14, cursor: "pointer",
                  }}>
                    🔄 重新生成
                  </button>
                  <button onClick={() => { setGenerated(null); setTopic(""); setSelectedPlatform(null); setSelectedType(null); }} style={{
                    padding: "12px 28px", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent", color: "rgba(255,255,255,0.5)",
                    fontSize: 14, cursor: "pointer",
                  }}>
                    ✕ 取消
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, letterSpacing: -0.5 }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>/ </span>发布记录
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MOCK_HISTORY.map((item, i) => {
                const platform = PLATFORMS.find(p => p.id === item.platform);
                return (
                  <div key={item.id} style={{
                    padding: "16px 20px", borderRadius: 14,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", gap: 16,
                    animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                  }}>
                    <span style={{ fontSize: 22 }}>{platform?.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                        {platform?.name} · {CONTENT_TYPES.find(t => t.id === item.type)?.name} · {item.time}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.tokens.toLocaleString()} tok
                    </div>
                    <div style={{
                      padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: item.status === "published" ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
                      color: item.status === "published" ? "#34d399" : "#fbbf24",
                    }}>
                      {item.status === "published" ? "已发布" : "草稿"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Success toast */}
      {showSuccess && (
        <div style={{
          position: "fixed", top: 32, left: "50%", transform: "translateX(-50%)",
          padding: "14px 28px", borderRadius: 14,
          background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
          color: "#34d399", fontSize: 14, fontWeight: 600,
          animation: "fadeIn 0.3s ease", zIndex: 100, backdropFilter: "blur(20px)",
        }}>
          ✅ 内容已成功发布！
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+SC:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}

function generateMockContent(topic, platform, type) {
  const templates = {
    article: `# ${topic}

在 AI 技术日新月异的今天，${topic}已经成为开发者不可忽视的重要方向。

## 核心观点

作为一名独立开发者，我在过去几个月中深入使用了多种 AI 工具，包括 Claude Code、MiMo V2.5 等，积累了大量实战经验。

### 1. 工具选型的关键考量

在实际开发中，模型的推理能力、上下文长度和 Token 效率是最核心的三个指标。以 MiMo V2.5-Pro 为例，其 1M 上下文窗口使得处理大型代码库成为可能。

### 2. 工作流优化

通过 Agent 化的工作流设计，我实现了从内容构思到发布的全自动化流程：
- 主题分析与关键词提取
- 多平台内容适配与生成
- 质量审核与自动发布

### 3. 效果数据

经过优化后，内容生产效率提升了约 3 倍，单日可产出 5-8 篇高质量内容，Token 使用效率较手动编写节省约 60%。

## 总结

${topic}的核心价值在于降低创作门槛、提升产出效率。期待未来更多优秀工具的出现。`,
    short: `🚀 ${topic}

分享一下最近的使用心得！

作为每天都在用 AI 工具的开发者，最近试了不少模型。说几个关键感受：

1️⃣ 推理速度和准确度同样重要
2️⃣ 长上下文对代码项目帮助巨大
3️⃣ 工具链的生态兼容性决定了实际体验

目前我的日常 workflow：Claude Code 做核心开发 + MiMo API 做内容生成和批处理，效率直接翻倍。

你们在用什么组合？评论区聊聊 👇

#AI开发 #效率工具 #独立开发者`,
    thread: `🧵 Thread: ${topic}

1/ 最近花了一周时间深入研究了这个方向，分享一些干货 👇

2/ 首先，为什么这个话题值得关注？简单来说：AI 工具的能力边界正在快速扩展，但大多数人的使用方式还停留在最基础的问答层面。

3/ 关键发现一：Agent 化的工作流比单次对话效率高 5-10 倍。我搭建了一个自动化 pipeline，从输入主题到产出成品只需要 2-3 分钟。

4/ 关键发现二：模型选择要看场景。复杂推理用 Pro 级模型，简单任务用轻量模型，成本可以降低 70% 以上。

5/ 关键发现三：提示工程仍然是最被低估的技能。好的 prompt 设计可以直接决定输出质量的上限。

6/ 总结：不要只把 AI 当聊天机器人用。把它当成你团队的一员，给它明确的角色和流程，效果会完全不一样。`,
    summary: `📝 ${topic} — 要点摘要

核心信息提炼：

▸ 背景：AI 内容创作工具正在从"辅助写作"进化到"自主创作"阶段
▸ 趋势：多模态、长上下文、Agent 化是三大方向
▸ 实践：成功的内容工作流需要工具链 + 流程设计 + 持续优化
▸ 数据：使用 AI 辅助后，内容产出效率平均提升 3-5 倍

关键洞察：技术能力本身不再是壁垒，如何设计高效的人机协作流程才是核心竞争力。`,
  };
  return templates[type] || templates.article;
}

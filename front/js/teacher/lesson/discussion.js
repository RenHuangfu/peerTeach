    // 初始化理由数据
    let reasons = []; // 每个选项的理由列表

    // 获取 DOM 元素
    let tabsContainer = document.getElementById("tabs");
    let reasonDisplay = document.getElementById("reason-display");

    // 当前选中的选项索引
    let selectedTab = 0;

    function generateDiscussion() {
        tabsContainer = document.getElementById("tabs");
        reasonDisplay = document.getElementById("reason-display");
        var question = currentQuestion;
        reasons = question.option.map(() => []); // 每个选项的理由列表
        selectedTab = 0; 
        tabsContainer.innerHTML = ""; // 清空选项卡容器
        reasonDisplay.innerHTML = "暂无理由"; // 清空理由展示区
        // 初始化选项卡
        question.option.forEach((opt, idx) => {
        const tab = document.createElement("button");
        tab.className = "option-tab";
        tab.textContent = opt.text;
        tab.addEventListener("click", () => {
            selectTab(idx);
        });
        if (idx === selectedTab) {
            tab.classList.add("active");
        }
        tabsContainer.appendChild(tab);
        });
        simulateWebSocket();
    }

    // 选项卡切换逻辑
    function selectTab(index) {
      // 更新选中状态
      const tabs = document.querySelectorAll(".option-tab");
      tabs.forEach((tab, idx) => {
        tab.classList.toggle("active", idx === index);
      });

      // 更新理由显示
      selectedTab = index;
      updateReasonDisplay(index);
    }

    // 更新理由展示区
    function updateReasonDisplay(index) {
      reasonDisplay.innerHTML = ""; // 清空展示区

      const currentReasons = reasons[index];

      if (currentReasons.length === 0) {
        reasonDisplay.textContent = "暂无理由";
        return;
      }

      reasons[index].forEach((reasonText, comment_index) => {
        const reasonItem = document.createElement("div");
        reasonItem.className = "reason-item";
        reasonItem.textContent = reasonText.content;

        const likeButton = document.createElement("button");
        likeButton.className = `like-button ${reasonText.is_like ? "liked" : ""}`;
        likeButton.innerHTML = "&#x1F44D;"; // 👍 Emoji
        likeButton.addEventListener("click", () => toggleLike(index,comment_index));

        const likeCount = document.createElement("span");
        likeCount.className = "like-count";
        likeCount.textContent = reasonText.likes;

        likeButton.appendChild(likeCount);
        reasonItem.appendChild(likeButton);

        reasonDisplay.appendChild(reasonItem);
      });
    }

    // 点赞功能
    function toggleLike(index, comment_index) {
        // 当前选项的第一个评论点赞状态切换
        const firstComment = reasons[index][comment_index];
        firstComment.is_like = !firstComment.is_like;
        firstComment.is_like ? firstComment.likes++ : firstComment.likes--;
  
        updateReasonDisplay(index); // 更新显示
      }
  
      // 处理服务器返回的评论数据
      function handleServerUpdate(data) {
        if (data.is_response) {
          data.comments.forEach((comment) => {
            const [questionId, optionIndex, reasonText] = comment.content.split("##");
            const index = parseInt(optionIndex); // 获取评论的选项索引
  
            // 确保只有该题目的评论被处理
            //if (parseInt(questionId) === currentQuestion.questionId) {
            if (parseInt(questionId) === 62) {
              // 将评论添加到对应选项的理由列表中
              reasons[index].push({
                content: reasonText,
                likes: comment.likes,
                is_like: comment.is_like
              });
  
              // 如果当前显示的是该选项，更新显示
              if (selectedTab === index) {
                updateReasonDisplay(index);
              }
            }
          });
        }
      }
  
      // 模拟接收服务器返回的评论数据
      function simulateWebSocket() {
        setTimeout(() => {
          handleServerUpdate({
            is_response: true,
            comments: [
              { content: "62##0##该选项有明显错误。", likes: 12, is_like: false },
              { content: "62##1##该选项有明显错误。", likes: 11, is_like: false },
              { content: "62##2##该选项有明显错误1。", likes: 14, is_like: false },
              { content: "62##2##该选项有明显错误2。", likes: 18, is_like: false },
              { content: "62##2##该选项有明显错误3。", likes: 19, is_like: false }
            ]
          });
        }, 2000);
  
        setTimeout(() => {
          handleServerUpdate({
            is_response: true,
            comments: [
              { content: "62##0##内亲解业山的理由不足，且逻辑有问题。", likes: 15, is_like: false }
            ]
          });
        }, 4000);
      }
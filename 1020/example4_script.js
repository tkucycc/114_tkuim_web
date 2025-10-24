// 分數等第判斷練習
var input = prompt('請輸入分數 (0–100)：');
var score = parseInt(input, 10);
var msg = '';

if (isNaN(score) || score < 0 || score > 100) {
  msg = '⚠️ 請輸入有效的分數 (0–100)';
} else {
  var grade = '';
  switch (true) {
    case (score >= 90):
      grade = 'A';
      break;
    case (score >= 80):
      grade = 'B';
      break;
    case (score >= 70):
      grade = 'C';
      break;
    case (score >= 60):
      grade = 'D';
      break;
    default:
      grade = 'F';
  }
  msg = `分數：${score}\n等第：${grade}`;
}

document.getElementById('result').textContent = msg;

---
title: "Mình code ít hơn, nhưng không có nghĩa là nhàn hơn"
short_title: "Tuấn Đào"
description: "Tuấn Đào kể cách anh dùng AI để code: từ pair programming mệt mỏi sang delegate, và vì sao bottleneck luôn nằm ở bước con người ngồi review."
date: 2026-10-22
slug: once-a-dwarf-tuan-dao
kind: essay
authors: []
credit: Tuấn Đào
series: once-a-dwarf
series_part: 1
tags:
  - once-a-dwarf
  - ai-in-their-words
  - ai
  - engineering
  - career
redirect:
  - /once-a-dwarf/tuan-dao
---

**Câu hỏi "AI có code được không?" giờ cũ quá rồi. AI code được. Cái khó là review sao cho đỡ nghẽn.**

Mình là Tuấn Đào, hiện mình làm software engineer ở Dwarves. Công việc hằng ngày vẫn là mấy việc quen thuộc của một dev: đọc code, hiểu requirement, tìm hướng xử lý, viết implementation, refactor, rồi kiểm tra lại trước khi đưa vào sản phẩm. Mình dùng AI nhiều nhất ở mấy đoạn như investigation, implementation, refactor. Những phần khác như test, debug, docs hay review thì vẫn có dùng, nhưng chưa nhiều bằng. Mình cũng muốn offload thêm mấy phần đó, hiện tại mình chưa tìm được setup nào đủ hiệu quả để dùng lâu dài.

## Pair programming, và sự mệt mỏi của nó

Hồi đầu, mình dùng AI gần giống như pair programming. Mình input task, assistant làm được khoảng 60%. Mình đọc qua, nhảy vào code tay thêm 30%, rồi lại prompt tiếp cho 10% còn lại. Mỗi bên làm một đoạn và ghép lại thành output cuối cùng. Làm một thời gian thì mình thấy cách đó vô cùng mất thời gian. Mình cứ phải đọc output, chỉnh sửa, quay lại prompt, rồi lại đọc tiếp. Nó tạo ra một kiểu context switching mới. Code vẫn ra thôi nhưng không còn là mình ngồi làm từ đầu tới cuối nữa, mà bị kéo qua nhiều vai cùng lúc: vừa là người viết, vừa là người sửa, vừa là người giải thích, vừa là người review. Có lúc cảm giác không giống pair programming nữa, mà như đang ngồi canh một output dở dang để chắp vá.

![Hai cách làm việc với AI: pair programming chia việc 60/30/10, delegate giao gần hết rồi đánh giá](assets/once-a-dwarf-tuan-dao-fig1-pair-vs-delegate.svg)

_Fig. 1: Từ ghép code từng mảnh sang giao trọn task rồi đánh giá._

## Delegate, không phải ném task rồi ngồi chơi

Gần đây, mình chuyển sang hướng delegate nhiều hơn. Mình giao task cho AI làm gần hết, rồi đánh giá kết quả của nó. Cách này hợp với mình hơn, nhưng nó không phải kiểu ném task cho AI xong ngồi chơi. Ngược lại, nó bắt mình chuẩn bị kỹ hơn trước khi giao việc. Nếu context thiếu, AI rất dễ hiểu sai. Mà cái khó chịu là nhiều khi nó hiểu sai nhưng output nhìn vẫn rất ổn, code sạch, flow có vẻ hợp lý, giải thích nghe cũng xuôi tai. Tới khi nhìn lại requirement mới thấy nó đang đi lan man giải sang bài toán khác.

Vì vậy, với mình, câu hỏi "AI làm tốt task nào nhất?" không quan trọng bằng chuyện mình giao việc cho nó như thế nào. Refactor, debug hay test chỉ là bề mặt. Cốt lõi vẫn là context. Nói đơn giản thì miễn là nó không chệch khỏi mục tiêu ban đầu, vậy là đã làm tốt rồi.

Những lần AI nhìn như có vẻ làm được hết nhưng cuối cùng vẫn cần mình review lại, thường là do planning ban đầu chưa kỹ và thiếu dữ kiện. Nó hỏi ngược lại mình, hoặc tự suy đoán. Mà tự suy đoán nhiều khi còn nguy hiểm hơn, vì nó đoán rất tự tin. Và một lỗi hay gặp nữa là không nói rõ definition of done. Thành thử, trước khi giao task, mình sẽ có một session planning với AI để làm rõ những chỗ nó còn thắc mắc. Cách này hơi mất công xíu, nhưng đỡ hơn nhiều so với để nó chạy sai rồi ngồi sửa lại.

## The orchestration tax

Do vậy mà testing với validation lại quan trọng hơn mình nghĩ. Nó góp phần không nhỏ trong việc kiểm soát được độ "ảo tưởng" của AI và giúp mình bớt review bằng cảm giác đi. Khả năng nhận thức của con người có giới hạn, còn số lượng agent mà 1 dev có thể spawn ra thì không, tỉ lệ này quá bất cân xứng nên bottleneck luôn luôn nằm ở bước con người review. Mình cũng không mở quá nhiều session cùng lúc: bình thường một hoặc hai, nhiều task nhỏ thì tối đa ba. Mở thêm session nghe có vẻ năng suất hơn, nhưng mỗi session lại tạo thêm một thứ phải đọc và check. Hoặc đơn giản là do mình gà hehe.

![Giao càng nhiều cho AI thì thời gian viết code giảm, còn công giữ context, đọc output và kiểm logic tăng](assets/once-a-dwarf-tuan-dao-fig2-orchestration-tax.svg)

_Fig. 2: "The Orchestration Tax", mượn chữ của Addy Osmani. Hình minh họa, không phải số đo._

Có một bài của Addy Osmani cho vấn đề này là "The Orchestration Tax". Nghe hơi fancy, mà khá đúng với cảm giác của mình dạo này. Khi giao nhiều việc hơn cho model, thời gian viết code giảm đi; đổi lại, mình tốn công hơn ở chỗ giữ context, đọc output, kiểm tra logic, và quyết định có nên dùng kết quả AI đưa ra.

Đúng là mình code ít hơn thiệt, và nghĩ nhiều hơn ở phần problem framing. Người ta có thể gọi đó là "engineer as orchestrator", mình vẫn thấy từ này hơi buzzword, mà harness engineering nghe còn buzz hơn *omegalul*. Bỏ lớp chữ nghĩa đó ra, việc hằng ngày của mình thật ra khá đơn giản: biết task nào giao được, cần đưa thông tin gì vào, đoạn nào để tool tự xử, đoạn nào mình phải tự quyết. Muốn làm vậy vẫn phải hiểu code, requirement, và có testcase hoặc một cách kiểm chứng rõ ràng hơn.

## Ba điều Tuấn rút ra

1. Bottleneck không nằm ở chỗ AI code nhanh hay chậm. Nó nằm ở bước con người ngồi review. Số agent gần như vô hạn, sức đọc của mình thì có giới hạn.
2. Mở thêm session không tự động bằng năng suất cao hơn. Mỗi session là một thứ nữa phải đọc và kiểm.
3. Context và "definition of done" quan trọng hơn việc chọn task nào cho AI. AI đoán sai một cách rất tự tin.

## 6 đến 12 tháng tới

Nếu có cải thiện workflow AI của mình thì chắc mình sẽ nhìn nhiều hơn vào testing và validation. Làm sao để bớt phải review mọi thứ bằng mắt. Làm sao để có cách kiểm chứng rõ hơn trước khi tin output. Nếu automate được một phần bước đó thì có lẽ hữu ích hơn việc chỉ cố làm cho AI viết thêm nhiều code.

Còn nếu không giải được chuyện review, mở thêm agent nhiều khi chỉ là tự tạo thêm việc cho mình thôi.

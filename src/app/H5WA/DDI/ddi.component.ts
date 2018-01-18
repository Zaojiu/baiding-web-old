import {Component, OnInit, OnDestroy} from '@angular/core';
import {DdiApiService} from '../../shared/api/ddi/ddi.api';
import {UtilsService} from '../../shared/utils/utils';
import {ShareBridge} from '../../shared/bridge/share.interface';
import {OperationTipsService} from '../../shared/operation-tips/operation-tips.service';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {ShareApiService} from '../../shared/api/share/share.api';
import {UserInfoService} from '../../shared/api/user-info/user-info.service';
import {Subscription} from 'rxjs/Rx';

@Component({
  templateUrl: './ddi.component.html',
  styleUrls: ['./ddi.component.scss'],
})

export class DdiComponent implements OnInit, OnDestroy {
  isInWechat = UtilsService.isInWechat;
  urlSub: Subscription;
  isAnswered = false;
  showContent = '';
  myAnswer = -1;
  answers = [-1, -1, -1, -1, -1, -1, -1];
  questionGroup = [
    {
      id: 0,
      question: '你看到有些团队成员凑在一起、小声说话。你认为：',
      choose: -1,
      answers: [
        '和你没关系',
        '他们又在浪费时间了',
        '是不是什么好玩的事儿',
        '他们可能需要我',
        '令你失控 —— 你想知道发生了什么事情',
        '你根本没注意到',
      ]
    },
    {
      id: 1,
      question: '你正在赶一个工作，你的团队中的成员走过来要求帮助，你会？',
      choose: -1,
      answers:
        [
          '先要求对方梳理好清单，再来找我',
          '我需要先完成我的任务。你在我的outlook上约好时间好吗？',
          '让他现在坐下，我可以帮助他们',
          '分享自己成功的故事',
          '觉得他们真的需要帮助',
          '想法很多，并且全部托盘而出',
        ]
    }
    ,
    {
      id: 2,
      question: '你在午餐时间怎么吃饭？',
      choose: -1,
      answers:
        [
          '独自在餐桌前吃饭',
          '在会议时间补充能量棒',
          '总是带别人一起吃饭，或在自助餐厅吃饭',
          '在餐厅吃，或者吃外卖',
          '处理当天出现的紧急情况',
          '出去散步或者跑步，同时思考一些事情',
        ]
    }
    ,
    {
      id: 3,
      question: '你假期时做什么？',
      choose: -1,
      answers:
        [
          '我在假期里做我个人爱好的事情',
          '很难充分利用假期',
          '根据自己的意愿安排时间，或者在游乐园与孩子共度闲暇时光',
          '有很多人约我，有时还要赶场',
          '比较喜欢呆在家里',
          '参加博物馆、参加演讲及展会，或者其他个人发展机会',
        ]
    }
    ,
    {
      id: 4,
      question: '当某人在会议中表达异议时，你如何回应？',
      choose: -1,
      answers:
        [
          '我会考虑这些信息，并进行思考',
          '告诉他必须坚持既定的方向，并将他们的意见制成表格，供下次开会使用',
          '我会尝试解决，并找出对每个人都有帮助的方法',
          '我会认为他们提出的意见都是针对我来的',
          '觉得他们说得对，必须考虑到风险',
          '发散想到其他可能性',
        ]
    }
    ,
    {
      id: 5,
      question: '在星期五便装日，你穿什么？',
      choose: -1,
      answers:
        [
          '根据那天心情而定',
          '穿我平常穿的工作服 —— 我不穿便服',
          '卡其裤和印有公司标志的Polo衫',
          '最流行的牛仔裤',
          '穿牛仔便装，但会准备一件外套，如果在最后几分钟举行会议，则会穿着这件外套',
          '我就穿平常穿的衣服',
        ]
    }
    ,
    {
      id: 6,
      question: '在放松和娱乐时喜欢喝什么酒',
      choose: -1,
      answers:
        [
          '啤酒',
          '根据当时的心情让酒保调制想喝的酒',
          '其他人喝啥我就喝啥',
          '来一杯最夯的鸡尾酒',
          '简单就好 —— 点店家推荐',
          '一杯红葡萄酒',
        ]
    }
  ];
  cover = '';
  btnTop: string;

  constructor(private ddiService: DdiApiService,
              private shareBridge: ShareBridge,
              private router: Router,
              private route: ActivatedRoute,
              private userInfoService: UserInfoService,
              private shareService: ShareApiService,
              private tooltips: OperationTipsService) {
  }

  ngOnInit() {
    this.getBtnTop();
    this.cover = 'https://og9s6vxbs.qnssl.com/ddi/ddi-cover.png';
    this.urlSub = this.route.url.subscribe(url => this.resetLoader(url));
  }

  ngOnDestroy() {
    if (this.urlSub) {
      this.urlSub.unsubscribe();
    }
  }

  resetLoader(url: UrlSegment[]) {
    this.setShareInfo();
    this.ddiService.getResult().then((res) => {
      this.myAnswer = res.result;
      this.answers = res.answer;
      this.isAnswered = true;
    }, () => {
      this.isAnswered = false;
    }).finally(() => {
      if (url[0].path === 'question') {
        this.showContent = 'question';
      }
      if (url[0].path === 'answer') {
        this.showContent = 'answer';
        if (!this.isAnswered) {
          this.router.navigate(['wa/ddi/question']);
        }
      }
      if (url[0].path === 'share') {
        this.showContent = 'share';
        if (!this.isAnswered) {
          this.router.navigate(['wa/ddi/question']);
        }
      }
    });
  }

  chooseAnswer(qusetionId, num) {
    if (this.isAnswered) {
      return;
    }
    this.answers[qusetionId] = num;
  }

  submitAnswer() {
    if (this.isAnswered) {
      this.router.navigate(['wa/ddi/answer']);
      return;
    }
    if (this.answers.indexOf(-1) !== -1) {
      this.tooltips.popup('请回答所有问题');
      return;
    }
    this.ddiService.postAnswer(this.answers).then((res) => {
      this.myAnswer = res;
      this.isAnswered = true;
      this.router.navigate(['wa/ddi/answer']);
    }, () => {
      console.log('post err');
    });
  }

  getBtnTop() {
    let width = Math.min(window.screen.width, 1024);
    this.btnTop = 70 * (width / 375) + 'px';
  }

  toShare() {
    this.router.navigate(['wa/ddi/share']);
  }

  addDdi() {
    location.href = 'https://www.zaojiu.com/events/5a4f1cffee805c000147464a/tickets';
  }
  toDownApp() {
    location.href = 'https://www.zaojiu.com/app?refer=h5ddi';
  }

  setShareInfo() {
    let shareTitle = '造就中高层领导者评鉴';
    let shareDesc = '你的职场性格和行事方式如何？测测你的职场角色吧！';
    let shareCover = 'http://www.zaojiu.tv/assets/img/zaojiu-logo.jpg';
    let shareUrl = location.href;
    this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareUrl);
  }
}

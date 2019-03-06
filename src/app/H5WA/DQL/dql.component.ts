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
  templateUrl: './dql.component.html',
  styleUrls: ['./dql.component.scss'],
})

export class DqlComponent implements OnInit, OnDestroy {
  isInWechat = UtilsService.isInWechat;
  urlSub: Subscription;
  isAnswered = false;
  showContent = '';
  myAnswer = -1;
  answers = [-1, -1, -1, -1, -1, -1, -1];
  questionGroup = [
    {
      id: 0,
      question: '遇到与自己相关的难题时',
      choose: -1,
      answers: [
        '没啥，把它当作别人的问题，照样能解决',
        '真有那么难吗？宝宝不信！',
        '现在虽然难，等三年五年后回头看，这根本就是沧海一粟',
        '死磕到底，绝不罢休',
        '评估一下解题风险，行动吧',
        '若能找到新的方法，也不啻为人生一大趣事',
      ]
    },
    {
      id: 1,
      question: '当你的思路被别人挑战时',
      choose: -1,
      answers:
        [
          '别人说的也有道理，博采众议',
          '你想过这些那些问题吗？待我来会会你',
          '嗯，我们俩的观点加起来，简直完美',
          '嗯，被挑战是正常的，坚持说服他，相信自己能行的',
          '你的方案忘记评估风险了呦',
          '我们说的都对，不试试知道谁的更对呢',
        ]
    }
    ,
    {
      id: 2,
      question: '面对奇装异服的时尚',
      choose: -1,
      answers:
        [
          '既然有人喜欢，那总是有可取之处',
          '这样真的好看吗？有些人真的品味有问题',
          '虽然百花齐放，但大趋势都是一致地',
          '世间再繁华，我自有我的STYLE',
          '这个风格好像我能驾驭，且试试效果咯',
          '让我不同色系不同风格都搭配着试试看，一天一个造型又何妨',
        ]
    }
    ,
    {
      id: 3,
      question: '领导说有个新项目交给你',
      choose: -1,
      answers:
        [
          '对新项目，我永远都有兴趣',
          '领导，你评估过我的能力吗？我是最合适的吗？',
          '不怕，且等我理出一个头绪来，事情就好办啦',
          '世上无难事，只怕有心人',
          '欧呦喂，既然是新项目，那我得先花点时间评估风险做好预案',
          '我有一个新的解题思路，哈哈，先小试身手一下',
        ]
    }
    ,
    {
      id: 4,
      question: '团队成员今天给了你一个反馈',
      choose: -1,
      answers:
        [
          '他还是有些地方说的对',
          '他了解我吗？他这么说依据的是啥？',
          '嗯，其实和我了解的自己趋势蛮一致的',
          '我一定要扭转他对我的看法，给自己打气！',
          '不知道他的看法是否会影响团队其他人怎么看我',
          '且让我了解一下团队其他人怎么看我不迟',
        ]
    }
    ,
    {
      id: 5,
      question: '遇到了个棘手客户',
      choose: -1,
      answers:
        [
          '相信客户也不会毫无道理，和他讨论一下再有结论不迟',
          '客户是中邪了吗？怎么会有这么离谱的想法',
          '嗯，好像我们的客户服务流程确实可以改善一下',
          '就不信我搞不定你，看招！',
          '让我看看这样处理，客户会离我们而去吗？',
          '见招拆招才好玩，就喜欢难缠的客户',
        ]
    },
    {
      id: 6,
      question: '老板想法一天变三变',
      choose: -1,
      answers:
        [
          '好像每次改变也确实有些道理哦',
          '老板到底想清楚没啊！',
          '其实吧，万变不离其宗，对我没啥影响',
          '我想了解我到底该做什么',
          '也好，待我看看怎么做前途最光明，才开始做',
          '哈哈，就算方向再变，解题思路总是在我脑中，拿走不谢',
        ]
    }
  ];
  cover = '';

  constructor(private ddiService: DdiApiService,
              private shareBridge: ShareBridge,
              private router: Router,
              private route: ActivatedRoute,
              private userInfoService: UserInfoService,
              private shareService: ShareApiService,
              private tooltips: OperationTipsService) {
  }

  ngOnInit() {
    this.cover = 'https://baiding-pub.zaojiu.com/dql/dql-cover.jpg';
    this.urlSub = this.route.url.subscribe(url => this.resetLoader(url));
  }

  ngOnDestroy() {
    if (this.urlSub) {
      this.urlSub.unsubscribe();
    }
  }

  resetLoader(url: UrlSegment[]) {
    this.setShareInfo();
    this.ddiService.getResult(1).then((res) => {
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
          this.router.navigate(['wa/dql/question']);
        }
      }
      if (url[0].path === 'share') {
        this.showContent = 'share';
        if (!this.isAnswered) {
          this.router.navigate(['wa/dql/question']);
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
      this.router.navigate(['wa/dql/answer']);
      return;
    }
    if (this.answers.indexOf(-1) !== -1) {
      this.tooltips.popup('请回答所有问题');
      return;
    }
    this.ddiService.postAnswer(this.answers, 1).then((res) => {
      this.myAnswer = res;
      this.isAnswered = true;
      this.router.navigate(['wa/dql/answer']);
    }, () => {
      console.log('post err');
    });
  }

  toShare() {
    this.router.navigate(['wa/dql/share']);
  }

  addMember() {
    location.href = 'https://www.zaojiu.com/new-member/action';
  }
  toDownApp() {
    location.href = 'https://www.zaojiu.com/app?refer=h5ddi';
  }

  setShareInfo() {
    let shareTitle = '造就潜力测试';
    let shareDesc = '你在数字话时代下的潜力如何？测测你的潜力大小吧！';
    let shareCover = 'http://www.zaojiu.tv/assets/img/zaojiu-logo.jpg';
    let shareUrl = location.href;
    this.shareBridge.setShareInfo(shareTitle, shareDesc, shareCover, shareUrl);
  }
}

<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div v-else>
      <div class="block" v-for="ticket in tickets">
        <div class="ticket-info">
          <img class="cover" :src="ticket.event.coverUrl" alt="头图">
          <div class="content">
            <strong class="subject">{{ticket.event.subject}}</strong>
            <div class="row">
              <span class="type">门票</span>
              <small class="time">{{ticket.applyAtParsed.format('MM/DD HH:mm:ss')}}</small>
            </div>
          </div>
        </div>
        <div class="detail">
          <div class="row">
            <span class="status unused" v-if="ticket.isUnused">未使用</span>
            <span class="status used" v-if="ticket.isUsed">已使用</span>
            <span class="tips">检票时，请出示票号或手机号</span>
          </div>
          <ul>
            <li>票号: <span class="text">{{ticket.ticketNo || '暂无'}}</span></li>
            <li>手机号: <span class="text">{{ticket.mobile || '暂无'}}</span></li>
            <li v-if="ticket.event.meta.startAt">时间: <span
              class="text">{{ticket.event.meta.startAtParsed.format('YYYY-MM-DD HH:mm:ss')}}<span
              v-if="ticket.event.meta.endAt"> - {{ticket.event.meta.endAtParsed.format('YYYY-MM-DD HH:mm:ss').replace(ticket.event.meta.startAtParsed.format('YYYY-MM-DD'), '')}}</span></span>
            </li>
            <li v-if="ticket.event.meta.address">地点: <span class="text"><span
              v-if="ticket.event.meta.city">{{ticket.event.meta.city}} </span>{{ticket.event.meta.address}}</span></li>
          </ul>
        </div>
      </div>
      <div class="no-more-record">到底啦~</div>
      <div class="no-record" v-if="tickets.length === 0">暂无可用票券</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    overflow: hidden;

    .loading, .error {
      display: block;
      background-color: $color-w;
      padding: 200px 0;
      text-align: center;
    }

    .block {
      padding-top: 20px;
      border-bottom: solid 10px $color-gray4;
      overflow: hidden;
    }

    .ticket-info {
      display: flex;

      .cover {
        flex-shrink: 0;
        width: 100px;
        height: 100px;
        object-fit: cover;
      }

      .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 0 15px;

        .subject {
          font-size: $font-size-sm;
          color: $color-b;
          word-break: break-all;
          white-space: pre-wrap;
          line-height: 1.5em;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-grow: 1;

          .type {
            flex-shrink: 0;
            font-size: $font-size-sm;
            color: $color-dark-gray;
            border-radius: 5px;
            padding: 4px 10px;
            border: solid 1px $color-dark-gray;
            transform: scale(.7);
            transform-origin: left center;
          }

          .time {
            font-size: $font-size-sm;
            color: $color-gray3;
          }
        }

        .amount {
          line-height: 1em;
          font-size: $font-size-md;
          color: $color-dark-gray;
        }
      }
    }

    .detail {
      margin: 20px;
      padding-top: 18px;
      border-top: solid 1px rgb(239, 239, 239);

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        .status {
          font-size: $font-size-md;
          font-weight: bold;

          &.unused {
            color: $color-danger;
          }

          &.used {
            color: $color-dark-gray;
          }
        }

        .tips {
          font-size: $font-size-sm;
          color: $color-b;
          font-weight: bold;
        }
      }

      ul {
        li {
          list-style: none;
          font-size: $font-size-md;
          line-height: 1.5em;
          margin-top: 10px;
        }

        li:first-child .text {
          font-weight: bold;
        }
      }
    }

    .no-more-record {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $color-gray4;
      padding: 5px 0 15px;
    }

    .no-record {
      padding: 20px;
      text-align: center;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import {tickets} from "../../shared/api/ticket.api";
  import {TicketModel} from "../../shared/api/ticket.model";
  import {scrollView} from '../../shared/scroll-view/scroll-view.directive';

  @Component({
    directives: {
      scrollView,
    }
  })
  export default class TicketComponent extends Vue {
    isLoading = false;
    isError = false;
    isOnLatest = false;
    tickets: TicketModel[] = [];
    marker = '';

    created() {
      this.initData();
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;

      try {
        const result = await tickets();
        this.tickets = result.tickets;
        this.marker = result.marker;
      } catch (e) {
        this.isError = true;
        throw e;
      } finally {
        this.isLoading = false;
      }
    }

    async onBottom() {
      if (this.isOnLatest) return;

      const result = await tickets(this.marker);
      this.tickets.push(...result.tickets);

      if (!result.marker) this.isOnLatest = true;

      this.marker = result.marker;
    }
  }
</script>

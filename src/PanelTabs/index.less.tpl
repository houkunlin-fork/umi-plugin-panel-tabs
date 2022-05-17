.panel-tabs-box {
  position: fixed;
  z-index: 9;
  width: 100%;
  height: 38px;
  background-color: #FFFFFF;
  border-bottom: 1px solid rgb(216, 220, 229);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 12%), 0 0 3px 0 rgba(0, 0, 0, 4%);

  .panel-tabs-bar {
    position: fixed;
    height: 38px;
    display: flex;
    overflow-x: scroll;
    padding: 0 50px 5px 5px;

    &::-webkit-scrollbar {
      display: none;
    }

    .panel-tabs-bar-tag {
      height: 26px;
      margin-top: 5px;
      text-align: center;
      line-height: 23px;
      font-size: 12px;
      cursor: pointer;
    }

    .panel-tabs-bar-more {
      background-color: #FFFFFF;
      position: fixed;
      right: 0;
      padding-right: 5px;
      height: 35px;
      text-align: center;
      line-height: 30px;
      // font-size: 18px;
    }
  }
}

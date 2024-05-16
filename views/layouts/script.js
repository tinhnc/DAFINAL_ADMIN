const socket = io("https://lit-caverns-06056-8076bdb8f402.herokuapp.com/");
toastr.options = {
  timeOut: 4000,
  positionClass: "toast-bottom-right",
  extendedTimeOut: 0,
  fadeOut: 3000,
  fadeIn: 0,
  showDuration: 0,
  hideDuration: 2000,
  debug: false,
};
socket.on("new-notification", (resp) => {
  const time = new Date().toLocaleString();
  const msg = `Khách
    hàng ${resp} đã đặt hàng lúc ${time} `;
  console.log(msg);
  toastr.success(msg, "New notification");
  setTimeout(() => {
    $.ajax({
      url: "/api/notification/notify",
      type: "GET",
      success: (data) => {
        console.log(data);
        updateNotification(data);
      },
    });
  }, 2000);
});
const updateNotification = (data) => {
  const dataNotSeen = data.filter((value) => {
    return !value.seen;
  });
  if (dataNotSeen.length > 0) {
    $(".icon-button__badge").html(dataNotSeen.length);
    $(".icon-button__badge").show();
  } else {
    $(".icon-button__badge").hide();
  }
  let html = "";
  for (let value of data) {
    html += ` < li class="starbucks
    success"> <div class="d - flex justify - content - around align - items -
    center"> < div class="notify_data" > <div class="title">${value.title}</div>
    <div class="sub_title"> ${value.content} lúc ${value.time} </div> </div > `;
    if (!value.seen) {
      const id = `${value._id} `;
      html += ` < div
    class="notify_status" > <p title="chưa xem" style="cursor: pointer;"
    onclick="updateStatusSeen('${id}')"> <i class="fas fa-circle"
    style="font-size: 12px; color: rgb(5, 126, 173)" ></i> </p> </div > `;
    } else {
      html += `< div class="notify_status" > <a title="đã xem" href="#"
    style="pointer-events: none; cursor: default;"> <i class="fas fa-circle"
    style="font-size: 12px; color: white" ></i> </a> </div > `;
    }
    html += `</div
    > </li > `;
  }
  let htmlCopy = html;
  if (data.length > 4) {
    html += ` < li
    class="show_all" > <p onclick="showAllNotification()" class="link">Show All
    Activities</p> </li`;
  }
  htmlCopy =
    ` < li class="title" > <p>All
    Notifications</p> <p class="close" onclick="closePopup()"> <i class="fas
    fa-times" aria-hidden="true"></i> </p> </li > ` + htmlCopy;
  $(".notification_ul").html(html);
  $(".all-notification_ul").html(htmlCopy);
};
const showAllNotification = () => {
  console.log("show all");
  $(".popup").show();
};
const closePopup = () => {
  $(".popup").hide();
};
const updateStatusSeen = (id) => {
  $.ajax({
    url: `/ api / notification / update -
    status / ${id}`,
    type: "GET",
    success: (data) => {
      console.log(data);
      updateNotification(data);
    },
  });
};
$(document).ready(() => {
  console.log("ready");
  $.ajax({
    url: "/api/notification/notify",
    type: "GET",
    success: (data) => {
      console.log(data);
      updateNotification(data);
    },
  });
});


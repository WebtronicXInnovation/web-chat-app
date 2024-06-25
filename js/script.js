$(document).ready(function () {
  let currentChatEmail = null; // No default chat contact
  let currentProfile = null; // Track the current profile
  let messageHistory = {}; // Object to store message history for each contact
  // Flag to track if a profile has been created
  let profileCreated = false;

  // Disable chat input initially
  disableChatInput();

  // Function to disable chat input and send button
  function disableChatInput() {
    $("#messageInput").prop("disabled", true);
    $("#sendMessageBtn").prop("disabled", true);
  }

  // Function to enable chat input and send button
  function enableChatInput() {
    $("#messageInput").prop("disabled", false);
    $("#sendMessageBtn").prop("disabled", false);
  }

  // Show the modal when clicking the New Chat button
  $("#newChatBtn").click(function () {
    $("#newChatModal").modal("show");
  });

  // Handle search functionality to filter contacts by name
  $("#searchInput").on("input", function () {
    const searchValue = $(this).val().toLowerCase();
    let resultsFound = false;

    $("#contactsList .list-group-item").each(function () {
      const contactName = $(this).text().toLowerCase();
      if (contactName.includes(searchValue)) {
        $(this).show();
        resultsFound = true;
      } else {
        $(this).hide();
      }
    });

    if (!resultsFound) {
      $("#noResultsMessage").show();
    } else {
      $("#noResultsMessage").hide();
    }

    // Reset "Go to Bottom" button visibility
    $("#goToBottomBtn").hide();
  });

  // Handle form submission in new chat modal to add new contact
  $("#newChatForm").submit(function (event) {
    event.preventDefault();

    var contactName = $("#contactName").val().trim();
    var contactEmail = $("#contactEmail").val().trim();
    // Regular expression for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if contact email already exists
    var existingEmail =
      $("#contactsList").find(`li[data-email="${contactEmail}"]`).length > 0;

    // Validate email format
    if (!emailRegex.test(contactEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (contactName !== "" && contactEmail !== "" && !existingEmail) {
      // Add new contact to the contact list
      var contactHtml = `
            <li class="list-group-item" data-email="${contactEmail}">
                ${contactName}
            </li>`;
      $("#contactsList").append(contactHtml);

      // Close the modal
      $("#newChatModal").modal("hide");

      // Clear input fields
      $("#contactName").val("");
      $("#contactEmail").val("");
    } else if (existingEmail) {
      alert("Email already exists in contacts.");
    }
  });

  // Handle click on contact to update chat header and messages
  $("#contactsList").on("click", ".list-group-item", function () {
    const name = $(this).text();
    const email = $(this).data("email");
    $("#chatWith").text(name);
    currentChatEmail = email;
    // Enable chat input and send button
    enableChatInput();
    // You can add functionality here to load the chat messages for this contact
    // Placeholder for no messages
    // Clear previous messages
    $("#chatMessages").html(
      '<div class="no-messages text-center"><p>No messages yet</p></div>'
    );

    // Remove selected class from all contacts
    // $("#contactsList .list-group-item").removeClass("selected-contact");

    $("#searchInput").val(""); // Clear the search input
    $("#contactsList .list-group-item").show(); // Reset contact list to show all contacts
    // Hide "No results found" message after selecting a contact
    $("#noResultsMessage").hide();
    // Add selected class to the clicked contact
    $(this).addClass("selected-contact");
  });

  // Scroll to bottom function
  function scrollToBottom() {
    $("#chatMessages").scrollTop($("#chatMessages")[0].scrollHeight);
  }

  // "Go to Bottom" icon functionality
  $("#goToBottomBtn").click(function () {
    scrollToBottom();
    $(this).hide(); // Hide the button after clicking
  });

  // Show "Go to Bottom" icon when scrolling up
  $("#chatMessages").scroll(function () {
    if ($(this).scrollTop() + $(this).innerHeight() < $(this)[0].scrollHeight) {
      $("#goToBottomBtn").fadeIn();
    } else {
      $("#goToBottomBtn").fadeOut();
    }
  });

  // script.js

  // Function to handle key press event in message input
  document
    .getElementById("messageInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        // Check if Enter key is pressed without Shift
        event.preventDefault(); // Prevent default behavior (e.g., newline in textarea)
        sendMessage(); // Call function to send message
      }
    });

  // Function to send message
  // function sendMessage() {
  //   // Get message from input field
  //   var message = document.getElementById("messageInput").value.trim();

  //   // Check if message is not empty
  //   if (message !== "") {
  //     // Replace with your sending logic (e.g., updating UI, sending data to server)
  //     console.log("Sending message:", message);

  //     // Clear input field after sending message
  //     document.getElementById("messageInput").value = "";
  //   }
  // }

  // Handle keyboard navigation for contacts after search
  $("#searchInput").keydown(function (event) {
    const $contacts = $("#contactsList .list-group-item:visible");
    let currentIndex = $contacts.index($(".list-group-item:focus"));

    switch (event.which) {
      case 38: // Up arrow
        event.preventDefault();
        if (currentIndex > 0) {
          currentIndex--;
        }
        break;
      case 40: // Down arrow
        event.preventDefault();
        if (currentIndex < $contacts.length - 1) {
          currentIndex++;
        }
        break;
      case 13: // Enter key
        event.preventDefault();
        if (currentIndex !== -1) {
          $contacts.eq(currentIndex).trigger("click");
        }
        break;
      default:
        return; // Exit this handler for other keys
    }

    $contacts.removeClass("focused");
    $contacts.eq(currentIndex).addClass("focused").focus();
  });

  // Add focus styling on contact click for keyboard navigation
  $("#contactsList").on("click", ".list-group-item", function () {
    $("#contactsList .list-group-item").removeClass("focused");
    $(this).addClass("focused");
  });

  // Function to send message
  function sendMessage() {
    // Get message from input field
    var message = $("#messageInput").val().trim();

    // Check if message is not empty
    if (message !== "") {
      // Simulate sending message to the chat window
      var messageHtml = `
            <div class="message outgoing-message">
                <div class="message-content">${message}</div>
            </div>`;
      $("#chatMessages").append(messageHtml);

      // Scroll to bottom of chat window
      scrollToBottom();

      // Clear input field after sending message
      $("#messageInput").val("");

      // Simulate receiving a response (for demonstration purposes)
      receiveMessage();
    }
  }

  // Function to simulate receiving a message (for demonstration purposes)
  function receiveMessage() {
    setTimeout(function () {
      var receivedMessage = "Hello! This is a received message.";
      var receivedMessageHtml = `
            <div class="message incoming-message">
                <div class="message-content">${receivedMessage}</div>
            </div>`;
      $("#chatMessages").append(receivedMessageHtml);

      // Scroll to bottom of chat window
      scrollToBottom();
    }, 1000); // Simulate delay for receiving message (1 second)
  }

  // Handle click on chat details icon
  $("#chatDetailsIcon").click(function () {
    if (currentChatEmail) {
      var $currentContact = $(
        `#contactsList .list-group-item[data-email="${currentChatEmail}"]`
      );
      var userName = $currentContact.text();
      var avatarText = userName.charAt(0).toUpperCase();
      var userEmail = $currentContact.data("email");

      $("#chatDetailsAvatar").text(avatarText);
      $("#chatDetailsNameInput").val(userName);
      $("#chatDetailsEmailInput").val(userEmail);

      $("#chatDetailsModal").modal("show");
    } else {
      alert("No contact selected.");
    }
  });

  // Handle edit icon click
  $("#editContactIcon").click(function () {
    $("#chatDetailsNameInput").prop("readonly", false);
    $("#chatDetailsEmailInput").prop("readonly", false);
    $("#saveContactDetails").show();
  });

  // Handle edit icon click
  $("#editContactIcon").click(function () {
    $("#chatDetailsNameInput").prop("readonly", false);
    $("#chatDetailsEmailInput").prop("readonly", false);
    $("#saveContactDetails").show();
  });

  // Handle save contact details
  $("#saveContactDetails").click(function () {
    var newName = $("#chatDetailsNameInput").val().trim();
    var newEmail = $("#chatDetailsEmailInput").val().trim();
    // Regular expression for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!emailRegex.test(newEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Check if the edited email already exists in another contact
    var existingEmailInOtherContact =
      $("#contactsList").find(
        `li[data-email="${newEmail}"]:not([data-email="${currentChatEmail}"])`
      ).length > 0;

    if (existingEmailInOtherContact) {
      alert("Email already exists in another contact.");
      return;
    }

    if (newName !== "" && newEmail !== "") {
      var $currentContact = $(
        `#contactsList .list-group-item[data-email="${currentChatEmail}"]`
      );
      $currentContact.text(newName).data("email", newEmail);

      $("#chatWith").text(newName);
      currentChatEmail = newEmail;

      $("#chatDetailsNameInput").prop("readonly", true);
      $("#chatDetailsEmailInput").prop("readonly", true);
      $("#saveContactDetails").hide();

      $("#chatDetailsModal").modal("hide");
    } else {
      alert("Both name and email are required.");
    }
  });

  $(".modal").on("shown.bs.modal", function () {
    $(this).find("input:first").focus();
  });
  // Focus the first input field in modals when they are opened
  $(".modal").on("shown.bs.modal", function () {
    $(this).find("input:first").focus();
  });

  // Handle Enter key navigation between input fields in modals
  $(".modal input").keydown(function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      var $inputs = $(this).closest(".modal").find("input");
      var nextInput = $inputs.eq($inputs.index(this) + 1);
      if (nextInput.length) {
        nextInput.focus();
      } else {
        $(this).closest("form").submit();
      }
    }
  });

  // Handle form submission in profile modal to create new profile
  $("#profileForm").submit(function (event) {
    event.preventDefault();

    var userName = $("#userName").val().trim();
    var userEmail = $("#userEmail").val().trim();
    var userPassword = $("#userPassword").val().trim();

    // Regular expression to validate email format
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Check if profile email already exists
    var existingEmail =
      $("#profileList").find(`.profile[data-email="${userEmail}"]`).length > 0;

    if (
      userName !== "" &&
      userEmail !== "" &&
      userPassword !== "" &&
      emailPattern.test(userEmail) &&
      !existingEmail
    ) {
      // Add profile to the left column (col-1) 
      var profileHtml = `
                <div class="profile" data-name="${userName}" data-email="${userEmail}">
                    <div class="profile-avatar">${userName
                      .charAt(0)
                      .toUpperCase()}</div>
                </div>`;
      $("#profileList").append(profileHtml);

      // Close the modal
      $("#profileModal").modal("hide");

      // Clear input fields
      $("#userName").val("");
      $("#userEmail").val("");
      $("#userPassword").val("");
    } else if (!emailPattern.test(userEmail)) {
      alert("Please enter a valid email address.");
    } else if (existingEmail) {
      alert("Email already exists in profiles.");
    }
  });

  // Show profile details in a modal when clicking on a profile
  $("#profileList").on("click", ".profile", function () {
    var name = $(this).data("name");
    var email = $(this).data("email");

    currentProfile = $(this);

    $("#profileDetailsNameInput").val(name);
    $("#profileDetailsEmailInput").val(email);
    $("#profileDetailsAvatar").text(name.charAt(0).toUpperCase());

    $("#profileDetailsModal").modal("show");
  });

  // Enable editing of profile details
  $("#editProfileDetailsBtn").click(function () {
    $("#profileDetailsNameInput").prop("readonly", false);
    $("#profileDetailsEmailInput").prop("readonly", false);
    $("#saveProfileDetailsBtn").show();
  });

  // Save edited profile details
  $("#saveProfileDetailsBtn").click(function () {
    var newName = $("#profileDetailsNameInput").val().trim();
    var newEmail = $("#profileDetailsEmailInput").val().trim();
    var newInitial = newName.charAt(0).toUpperCase();

    // Regular expression to validate email format
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (newName !== "" && newEmail !== "" && emailPattern.test(newEmail)) {
      // Update profile item
      currentProfile.data("name", newName);
      currentProfile.data("email", newEmail);
      currentProfile.find(".profile-avatar").text(newInitial);
      currentProfile.find(".profile-name").text(newName.slice(0, 4));

      // Update modal and profile list
      $("#profileDetailsAvatar").text(newInitial);
      $("#profileDetailsNameInput").val(newName);
      $("#profileDetailsEmailInput").val(newEmail);

      $("#profileDetailsNameInput").prop("readonly", true);
      $("#profileDetailsEmailInput").prop("readonly", true);
      $("#saveProfileDetailsBtn").hide();

      $("#profileDetailsModal").modal("hide");
    } else if (!emailPattern.test(newEmail)) {
      alert("Please enter a valid email address.");
    } else {
      alert("Both name and email are required.");
    }
  });

  // Focus the first input field in modals when they are opened
  $(".modal").on("shown.bs.modal", function () {
    $(this).find("input:first").focus();
  });

  // Handle Enter key navigation between input fields in modals
  $(".modal input").keydown(function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const $inputs = $(this).closest(".modal").find("input");
      const nextInput = $inputs.eq($inputs.index(this) + 1);
      if (nextInput.length) {
        nextInput.focus();
      } else {
        $(this).closest("form").submit();
      }
    }
  });

  $("#contactsList").on("click", ".list-group-item", function () {
    const name = $(this).text();
    const email = $(this).data("email");

    // Clear previous chat messages
    $("#chatMessages").empty();

    // Load messages for the selected contact
    loadMessages(email);

    // Update current chat contact
    currentChatEmail = email;
    $("#chatWith").text(name);

    // Enable chat input and send button
    enableChatInput();

    // Hide "No results found" message after selecting a contact
    $("#noResultsMessage").hide();
  });

  function loadMessages(email) {
    // Check if message history exists for this contact
    if (!messageHistory[email]) {
      messageHistory[email] = []; // Initialize message history if not exists
    }

    // Display messages for the selected contact
    messageHistory[email].forEach(message => {
      displayMessage(message);
    });

    // Scroll to bottom of chat window
    scrollToBottom();
  }

  // Function to send message
  function sendMessage() {
    // Get message from input field
    var message = $("#messageInput").val().trim();

    // Check if message is not empty
    if (message !== "") {
      // Add message to message history for current contact
      if (!messageHistory[currentChatEmail]) {
        messageHistory[currentChatEmail] = []; // Initialize if not exists
      }
      messageHistory[currentChatEmail].push({
        sender: "Me",
        message: message,
        timestamp: new Date(),
      });

      // Display message in chat window
      displayMessage({
        sender: "Me",
        message: message,
        timestamp: new Date(),
      });

      // Clear input field after sending message
      $("#messageInput").val("");

      // Scroll to bottom of chat window
      scrollToBottom();
    }
  }

  function displayMessage(message) {
    var messageHtml = `
    <div class="message ${message.sender === "Me" ? "sender" : "receiver"}">
      <div class="message-content">${message.message}</div>
    </div>`;
    $("#chatMessages").append(messageHtml);

    // Scroll to bottom of chat window
    scrollToBottom();
  }
  // Example usage
  var messageFromMe = {
    sender: "Me",
    message: "Hello!",
  };

  var messageFromReceiver = {
    sender: "John", // or any other identifier for the receiver
    message: "Hi there!",
  };

  // Display messages
  displayMessage(messageFromMe);
  displayMessage(messageFromReceiver);

  //ajax validation for profile email
  $("#userEmail").on("keyup", function () {
    var mailformat = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    var email = $("#userEmail").val();
    if (email.match(mailformat)) {
      $("#profilemsg").html("valid").css("color", "green");
      $("#enter").prop("disabled", false);
    } else $("#profilemsg").html("Invalid Email").css("color", "red");
  });

  //ajax validation for Profile Details Modal email
  $("#profileDetailsEmailInput").on("keyup", function () {
    // var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var mailformat = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    var email = $("#profileDetailsEmailInput").val();
    if (email.match(mailformat)) {
      $("#profiledetailmessage").html("valid").css("color", "green");
      $("#enter").prop("disabled", false);
    } else $("#profiledetailmessage").html("Invalid Email").css("color", "red");
  });

  //ajax validation for new chat email
  $("#contactEmail").on("keyup", function () {
    var mailformat = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    var email = $("#contactEmail").val();
    if (email.match(mailformat)) {
      $("#newchatemailmsg").html("valid").css("color", "green");
      $("#enter").prop("disabled", false);
    } else $("#newchatemailmsg").html("Invalid Email").css("color", "red");
  });

  //ajax validation for chat detail email
  $("#chatDetailsEmailInput").on("keyup", function () {
    var mailformat = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    var email = $("#chatDetailsEmailInput").val();
    if (email.match(mailformat)) {
      $("#chatdetailmsg").html("valid").css("color", "green");
      $("#enter").prop("disabled", false);
    } else $("#chatdetailmsg").html("Invalid Email").css("color", "red");
  });

});


  
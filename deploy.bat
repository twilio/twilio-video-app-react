robocopy build ..\VideoMeetings\VideoMeetings\wwwroot\video /purge
robocopy build\static ..\VideoMeetings\VideoMeetings\wwwroot\static /MIR

robocopy build ..\VideoMeetings\SystemTest\wwwroot\video /purge
robocopy build\static ..\VideoMeetings\SystemTest\wwwroot\static /MIR

robocopy src ..\VideoMeetings\TwilioApp\src  /MIR



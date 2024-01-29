# C# API examples

## Note: on OpenLibrary people API's
For API's that reference a specific users data such as those API's that start with people.  Substitute {Profile Display Name} with the authenticated user or public data's profile display name.

https://openlibrary.org/people/{Profile Display Name}/books/want-to-read.json
https://openlibrary.org/people/{Profile Display Name}/books/currently-reading.json
https://openlibrary.org/people/{Profile Display Name}/books/already-read.json

## Login into OpenLibrary with Access Credentials

`public async Task<ErrorReturn> Login(string AccessKeyString, string SecretString, string OL_ProfileID)
{
    _AccessKeyString = AccessKeyString;
    _SecretString = SecretString;   
    _OL_ProfileID = OL_ProfileID;

    ErrorReturn loginReturn = new ErrorReturn();
    try
    {
       
        var client = new HttpClient();
       
        var content = new StringContent($"{{\"access\": \"{AccessKeyString}\", \"secret\": \"{SecretString}\"}}", Encoding.Unicode, "application/json");
        client.DefaultRequestHeaders.Add("Accept", "application/json");
        client.DefaultRequestHeaders.Add("User-Agent", "MyNextBook");
       
        var response = await client.PostAsync(LoginUrl, content);

        if (response.IsSuccessStatusCode)
        {
       

            var sessionCookie = response.Headers.GetValues("Set-Cookie");
            ol_sessionid = string.Join(", ", sessionCookie);
            var ss = ol_sessionid.Split(";");
            string s = ss[0];
            ol_sessionid = s;
            //return string.Join(", ", sessionCookie);
            loginReturn.success = true;
            return loginReturn;
        }
        else
        {
            loginReturn.ErrorCode = "GEN-001";
            ol_sessionid = "";
            Debug.WriteLine($"Login failed with status code: {response.StatusCode}");
            loginReturn.ErrorMessage = response.Content.ReadAsStringAsync().Result;
            loginReturn.Success = false;
            loginReturn.ErrorReason = response.ReasonPhrase;
            return loginReturn;
        }
    }
    catch (Exception ex)
    {

        Debug.WriteLine($"Exception occurred during login: {ex.Message} : {ex.ToString()}");
        loginReturn.ErrorCode = "GEN-002";
        loginReturn.ErrorMessage = ex.Message;
        loginReturn.Success = false;
        loginReturn.ErrorReason = ex.ToString();
        return loginReturn;
    }
}`
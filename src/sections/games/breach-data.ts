/**
 * A small, local list of extremely common / frequently-breached passwords
 * (compiled from widely published "most common passwords" research — e.g.
 * annual worst-password roundups and public breach-corpus analyses). This
 * is intentionally short and bundled directly in the app; there is no API
 * call to a leaked-password service, so nothing you type is ever
 * transmitted anywhere.
 */
export const COMMON_PASSWORDS: ReadonlySet<string> = new Set(
  [
    "123456", "123456789", "12345678", "12345", "1234567", "1234567890", "1234",
    "111111", "000000", "123123", "666666", "121212", "654321", "222222", "112233",
    "password", "password1", "passw0rd", "iloveyou", "qwerty", "qwerty123", "qwertyuiop",
    "1q2w3e4r", "1q2w3e4r5t", "1qaz2wsx", "zaq1zaq1", "asdfghjkl", "asdasd", "zxcvbnm",
    "abc123", "abcd1234", "a1b2c3", "123qwe", "qwe123",
    "monkey", "monkey123", "dragon", "master", "master1", "letmein", "letmein1",
    "football", "baseball", "basketball", "soccer", "hockey",
    "sunshine", "princess", "flower", "superman", "batman", "starwars", "pokemon",
    "shadow", "shadow1", "trustno1", "hunter2", "whatever", "freedom", "welcome",
    "login", "admin", "administrator", "root", "toor", "guest", "default", "changeme",
    "test123", "temp1234", "access", "mustang", "harley", "ranger", "buster",
    "michael", "jennifer", "jordan", "ashley", "bailey", "michelle", "charlie",
    "hottie", "loveme", "solo", "iloveu", "iloveyou1", "loveyou",
    "654321", "123321", "aa123456", "1qazxsw2", "qazwsx", "qazwsxedc",
    "summer2026", "winter2026", "spring2026", "autumn2026", "baruch2026",
    "cyberpunk", "hacker", "hackme", "letmein123", "passwordpassword",
  ].map((p) => p.toLowerCase()),
);

# MultiMatch: checking if a string is in a very large array (> 100k)

The usage scenario is, let say you have a long list of sha256 hash (say, 100k of them), and you want to check if a particular string is one of these hash. 

According to my finding, `Set.has()` (or Object.has) is always faster, so you shouldn't use this code.

# Case sensitive

The match is always case sensitive, if you want to do case insensitive search, call `string.toLowerCase()`

# Performance

| Test case                      | MultiMatch | Regex  | Set.hash |
|:-------------------------------|:-----------|:------ |:---------|
| search 100 items in 10k array  | 0ms        | 77ms   | 0ms      |
| search 100 items in 50k array  | 1ms        | 385ms  | 1ms      |
| search 100 items in 100k array | 1ms        | 938ms  | 1ms      |
| search 5k items in 100k array  | 76ms       | 850ms  | 24ms     |
| search 50k items in 100k array | 365ms      | 1258ms | 242ms    |
| search 50k items in 500k array | 411ms      | N/A    | 265ms    |
| search 1M items in 500k array  | 7950ms     | N/A    | 5310ms   |
| search 1M items in 1M array    | 8294ms     | N/A    | 5779ms   |


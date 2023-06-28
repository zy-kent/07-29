// 错误的集合
// 集合 s 包含从 1 到 n 的整数。不幸的是，因为数据错误，导致集合里面某一个数字复制了成了集合里面的另外一个数字的值，导致集合 丢失了一个数字 并且 有一个数字重复 。给定一个数组 nums 代表了集合 S 发生错误后的结果

public int[] findErrorNums(int[] nums) {
    int n = nums.length;
    int xor = 0;
    for (int num : nums) {
        xor ^= num;
    }
    for (int i = 1; i <= n; i++) {
        xor ^= i;
    }
    int lowbit = xor & (-xor);
    int num1 = 0, num2 = 0;
    for (int num : nums) {
        if ((num & lowbit) == 0) {
            num1 ^= num;
        } else {
            num2 ^= num;
        }
    }
    for (int i = 1; i <= n; i++) {
        if ((i & lowbit) == 0) {
            num1 ^= i;
        } else {
            num2 ^= i;
        }
    }
    for (int num : nums) {
        if (num == num1) {
            return new int[]{num1, num2};
        }
    }
    return new int[]{num2, num1};
}

// 数组的度
// 给定一个非空且只包含非负数的整数数组 nums, 数组的度的定义是指数组里任一元素出现频数的最大值
// 你的任务是在 nums 中找到与 nums 拥有相同大小的度的最短连续子数组，返回其长度

public int findShortestSubArray(int[] nums) {
    Map<Integer, int[]> map = new HashMap<Integer, int[]>();
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        if (map.containsKey(nums[i])) {
            map.get(nums[i])[0]++;
            map.get(nums[i])[2] = i;
        } else {
            map.put(nums[i], new int[]{1, i, i});
        }
    }
    int maxNum = 0, minLen = 0;
    for (Map.Entry<Integer, int[]> entry : map.entrySet()) {
        int[] arr = entry.getValue();
        if (maxNum < arr[0]) {
            maxNum = arr[0];
            minLen = arr[2] - arr[1] + 1;
        } else if (maxNum == arr[0]) {
            if (minLen > arr[2] - arr[1] + 1) {
                minLen = arr[2] - arr[1] + 1;
            }
        }
    }
    return minLen;
}

// 找到所有数组中消失的数字
// 给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字，并以数组的形式返回结果
public List<Integer> findDisappearedNumbers(int[] nums) {
    int n = nums.length;
    for (int num : nums) {
        int x = (num - 1) % n;
        nums[x] += n;
    }
    List<Integer> ret = new ArrayList<Integer>();
    for (int i = 0; i < n; i++) {
        if (nums[i] <= n) {
            ret.add(i + 1);
        }
    }
    return ret;
}
// 数组中重复的数据
// 给你一个长度为 n 的整数数组 nums ，其中 nums 的所有整数都在范围 [1, n] 内，且每个整数出现 一次 或 两次 。请你找出所有出现 两次 的整数，并以数组形式返回。

public List<Integer> findDuplicates(int[] nums) {
    int n = nums.length;
    List<Integer> ans = new ArrayList<Integer>();
    for (int i = 0; i < n; ++i) {
        int x = Math.abs(nums[i]);
        if (nums[x - 1] > 0) {
            nums[x - 1] = -nums[x - 1];
        } else {
            ans.add(x);
        }
    }
    return ans;
}

// 缺失的第一个正数
// 给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数
public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; ++i) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            int temp = nums[nums[i] - 1];
            nums[nums[i] - 1] = nums[i];
            nums[i] = temp;
        }
    }
    for (int i = 0; i < n; ++i) {
        if (nums[i] != i + 1) {
            return i + 1;
        }
    }
    return n + 1;
}

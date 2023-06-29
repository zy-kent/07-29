// 合并两个有序数组
// 给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
// 请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
// 以指针设置为从后向前遍历，每次取两者之中的较大者放进 nums1的最后面 -- 逆向双指针

public void merge(int[] nums1, int m, int[] nums2, int n) {
    int p1 = m - 1, p2 = n - 1;
    int tail = m + n - 1;
    int cur;
    while (p1 >= 0 || p2 >= 0) {
        if (p1 == -1) {
            cur = nums2[p2--];
        } else if (p2 == -1) {
            cur = nums1[p1--];
        } else if (nums1[p1] > nums2[p2]) {
            cur = nums1[p1--];
        } else {
            cur = nums2[p2--];
        }
        nums1[tail--] = cur;
    }
}

// 移除元素
// 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度
// 可以使用双指针：右指针 right\textit{right}right 指向当前将要处理的元素，左指针 left\textit{left}left 指向下一个将要赋值的位置
// 如果右指针指向的元素不等于 val\textit{val}val，它一定是输出数组的一个元素，我们就将右指针指向的元素复制到左指针位置，然后将左右指针同时右移
// 如果右指针指向的元素等于 val\textit{val}val，它不能在输出数组里，此时左指针不动，右指针右移一位。
public int removeElement(int[] nums, int val) {
    int n = nums.length;
    int left = 0;
    for (int right = 0; right < n; right++) {
        if (nums[right] != val) {
            nums[left] = nums[right];
            left++;
        }
    }
    return left;
}

// 删除有序数组中的重复项
// 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度
// 元素的 相对顺序 应该保持 一致 。然后返回 nums 中唯一元素的个数
public int removeDuplicates(int[] nums) {
    int n = nums.length;
    if (n == 0) {
        return 0;
    }
    int fast = 1, slow = 1;
    while (fast < n) {
        if (nums[fast] != nums[fast - 1]) {
            nums[slow] = nums[fast];
            ++slow;
        }
        ++fast;
    }
    return slow;
}
// 删除有序数组中的重复项 II
// 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使得出现次数超过两次的元素只出现两次 ，返回删除后数组的新长度。
public int removeDuplicates(int[] nums) {
    int n = nums.length;
    if (n <= 2) {
        return n;
    }
    int slow = 2, fast = 2;
    while (fast < n) {
        if (nums[slow - 2] != nums[fast]) {
            nums[slow] = nums[fast];
            ++slow;
        }
        ++fast;
    }
    return slow;
}
// 多数元素
// 给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。
// Boyer-Moore 投票算法
// 核心就是对拼消耗。我们将数组 nums\textit{nums}nums 中的首个元素 xx 作为「众数」，并初始化它的「票数」为 1
// 如果我们把众数记为 +1+1+1，把其他数记为 −1-1−1，将它们全部加起来，显然和大于 0，从结果本身我们可以看出众数比其他数多
public int majorityElement(int[] nums) {
    int count = 0;
    Integer candidate = null;

    for (int num : nums) {
        if (count == 0) {
            candidate = num;
        }
        count += (num == candidate) ? 1 : -1;
    }

    return candidate;
}
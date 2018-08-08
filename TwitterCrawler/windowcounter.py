import time

class windowcounter(object):
    nums = []
    max_duration = 0
    precision = 0
    sum = 0

    def __init__(self, max_duration, precision = 1):
        self.max_duration = max_duration # seconds
        self.precision = precision
        self.sum = 0

    def refresh(self):
        now = time.time()
        pivot = now - self.max_duration
        while len(self.nums) and self.nums[0][0] < pivot:
            t, n = self.nums.pop(0)
            self.sum -= n

    def add(self, num):
        now = time.time()
        if len(self.nums) > 0 and now - self.nums[-1][0] < self.precision:
            self.nums[-1][1] += num
        else:
            self.nums.append([now, num])
        self.sum += num
        self.refresh()
        return self.sum

    def __len__(self):
        self.refresh()
        return len(self.nums)

    def __call__(self, *args, **kwargs):
        if len(args):
            self.add(args[0])
        return self.add(0)


if __name__ == '__main__':
    sec_counter = windowcounter(1)
    for i in range(10):
        print(time.time(), sec_counter(10))
        time.sleep(0.35)
    for i in range(10):
        print(time.time(), sec_counter(10))
        time.sleep(1.5)
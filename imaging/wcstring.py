# -*- coding: utf-8 -*-


class wcstr(str):
    def __new__(*args, **kwargs):
        return str.__new__(*args, **kwargs)

    def __init__(self, *args, **kwargs):
        self._update()

    def _update(self):
        self.bitindex = []
        for i, j in zip(str(self), range(len(str(self)))):
            iwidth = 1 if len(i.encode('utf8')) <= 2 else 2
            self.bitindex += [j] * iwidth

    def __len__(self):
        return len(self.bitindex)

    def __getitem__(self, y):
        if type(y) == int:
            return wcstr(super(wcstr, self).__getitem__(self.bitindex[y]))
        elif type(y) == slice:
            start = self.bitindex[y.start] if y.start else None
            if y.stop and y.stop < len(self.bitindex):
                stop = self.bitindex[y.stop] if y.stop else None
            else:
                stop = None
            step = y.step
            return wcstr(
                super(wcstr, self).__getitem__(slice(start, stop, step)))
        else:
            return

    def dupstr(self):
        # return a duplicated string with every element
        # indicating one-width character
        return ''.join([self[i] for i in range(len(self))])

    # alias for other str methods

    def __add__(self, *args, **kwargs):
        return wcstr(super(wcstr, self).__add__(*args, **kwargs))

    def __mul__(self, value):
        return wcstr(super(wcstr, self).__mul__(value))

    def __rmul__(self, *args, **kwargs):
        return wcstr(super(wcstr, self).__rmul__(*args, **kwargs))

    def __format__(self, *args, **kwargs):
        return wcstr(super(wcstr, self).__format__(*args, **kwargs))

    def center(self, width, fillchar=' '):
        filllen = (width - len(self)) // 2
        return wcstr(fillchar * filllen + self + fillchar *
                     (width - len(self) - filllen))

    #return super(wcstr, self).center(width - len(self) +
    #        len(str(self)))

    def casefold(self, *args, **kwargs):
        return wcstr(super(wcstr, self).casefold(*args, **kwargs))

    def capitalize(self, *args, **kwargs):
        return wcstr(super(wcstr, self).capitalize(*args, **kwargs))

    def expandtabs(self, *args, **kwargs):
        return wcstr(super(wcstr, self).expandtabs(*args, **kwargs))

    def format(self, *args, **kwargs):
        return wcstr(super(wcstr, self).format(*args, **kwargs))

    def format_map(self, *args, **kwargs):
        return wcstr(super(wcstr, self).format_map(*args, **kwargs))

    def join(self, *args, **kwargs):
        return wcstr(super(wcstr, self).join(*args, **kwargs))

    def ljust(self, *args, **kwargs):
        return wcstr(super(wcstr, self).ljust(*args, **kwargs))

    def lower(self, *args, **kwargs):
        return wcstr(super(wcstr, self).lower(*args, **kwargs))

    def lstrip(self, *args, **kwargs):
        return wcstr(super(wcstr, self).lstrip(*args, **kwargs))

    def replace(self, *args, **kwargs):
        return wcstr(super(wcstr, self).replace(*args, **kwargs))

    def rjust(self, *args, **kwargs):
        return wcstr(super(wcstr, self).rjust(*args, **kwargs))

    def rstrip(self, *args, **kwargs):
        return wcstr(super(wcstr, self).rstrip(*args, **kwargs))

    def strip(self, *args, **kwargs):
        return wcstr(super(wcstr, self).strip(*args, **kwargs))

    def swapcase(self, *args, **kwargs):
        return wcstr(super(wcstr, self).swapcase(*args, **kwargs))

    def title(self, *args, **kwargs):
        return wcstr(super(wcstr, self).title(*args, **kwargs))

    def translate(self, *args, **kwargs):
        return wcstr(super(wcstr, self).translate(*args, **kwargs))

    def upper(self, *args, **kwargs):
        return wcstr(super(wcstr, self).upper(*args, **kwargs))

    def zfill(self, *args, **kwargs):
        return wcstr(super(wcstr, self).zfill(*args, **kwargs))

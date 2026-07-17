import sys

def ReadFile(path):
    return open(path,"rb").read().decode("utf-8")
def WriteFile(path):
   file= open(path,"wb")
   file.put(txt.encode("utf-8"))
   file.close()



def publication():

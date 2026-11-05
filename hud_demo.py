"""Stationary-only HUD renderer protocol prototype; not an MGU Store package."""
import json, socket, struct, time
from PIL import Image, ImageDraw, ImageFont

SOCKET = '/dev/shm/cluster-render/render.sock'
WIDTH, HEIGHT = 210, 245
REF = 4401

def fahrenheit(c): return round(c * 9 / 5 + 32)
def psi(gauge_bar): return round(gauge_bar * 14.5037738, 1)

def panel(oil_c=103, coolant_c=95, boost_gauge_bar=1.25):
    im = Image.new('RGBA', (WIDTH, HEIGHT), (0,0,0,0))
    d = ImageDraw.Draw(im)
    labels = [('OIL', f'{fahrenheit(oil_c)} F'), ('COOLANT', f'{fahrenheit(coolant_c)} F'), ('BOOST', f'{psi(boost_gauge_bar):.1f} PSI')]
    for i,(name,value) in enumerate(labels):
        y = i * 81
        d.rounded_rectangle((2,y+2,WIDTH-3,y+74),radius=12,fill=(6,18,29,195),outline=(65,118,143,215),width=2)
        d.text((14,y+10),name,fill=(143,204,227,255))
        d.text((14,y+35),value,fill=(255,255,255,255))
    return im

def send(sock, kind, body):
    payload = kind.encode('ascii') + body
    sock.sendall(struct.pack('<I',len(payload)) + payload)

def send_json(sock,obj): send(sock,'J',json.dumps(obj,separators=(',',':')).encode())

def main():
    print('DEMO ONLY: Park vehicle. Does not access DME or live signals.')
    with socket.socket(socket.AF_UNIX,socket.SOCK_STREAM) as s:
        s.connect(SOCKET)
        send_json(s,{'op':'hello','app':'m440i-hud-demo','proto':1})
        # Transparent, nonexclusive image layer on the right of the 800x480 HUD target.
        send_json(s,{'op':'layer','ref':REF,'target':'hud','kind':'image','class':'overlay','z':30,'x':570,'y':110,'w':WIDTH,'h':HEIGHT,'iw':WIDTH,'ih':HEIGHT,'visible':1,'exclusive':0,'contend':0})
        image = panel()
        frame = struct.pack('<IQH',REF,1,0) + image.tobytes()
        send(s,'F',frame)
        print('Sent one static test frame; Ctrl+C to close overlay.')
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass

if __name__ == '__main__': main()

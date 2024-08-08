import hashlib
import uuid
import requests


class SpeedTest:
    def __init__(self, ping, upload_mbps, download_mbps, key, upload_ping, download_ping, idle_latency, server_id):
        self.ping = ping
        self.upload = str(float(upload_mbps) * 1000)
        self.download = str(float(download_mbps) * 1000)
        self.key = key
        self.upload_ping = upload_ping
        self.download_ping = download_ping
        self.idle_latency = idle_latency
        self.server_id = server_id
        self.sig = self.generate_signature()

    def generate_signature(self):
        presig = "-".join([self.ping, self.upload, self.download, self.key])
        return hashlib.md5(presig.encode()).hexdigest()

    def get_json_data(self):
        return {
            'app': {
                'sdk': {
                    'commit': 'f6b050be7bf06ca243f95e60eafff740cc401b9a',
                    'version': '2.8.17',
                },
            },
            'serverid': self.server_id,
            'testmethod': 'wss,xhrs,xhrs',
            'source': 'st4-js',
            'configs': {
                'remoteDebugging': False,
                'maxDisplayServers': 20,
                'requestWebLocation': True,
                'shortTests': False,
                'automaticStageProgression': False,
                'eventSkipInterval': 2,
                'latency': {
                    'maxServers': 10,
                },
                'jsEngine': {
                    'saveContentType': 'application/json',
                    'saveType': 'st4-js',
                },
                'stagesList': [
                    'latency',
                    'download',
                    'upload',
                    'save',
                ],
                'loadedLatency': {
                    'enabled': True,
                },
                'swf': {
                    'engine': '/engine.swf',
                    'express': '/expressInstall.swf',
                },
                'vpnDetected': False,
                'logErrorsToServer': False,
                'connections': {
                    'isVpn': False,
                    'selectionMethod': 'auto',
                    'mode': 'multi',
                },
                'experiments': {},
                'latencyProtocol': 'ws',
                'downloadProtocol': 'xhr',
                'uploadProtocol': 'xhr',
                'host': 'perf.keyyo.net',
                'port': 8080,
                'serverVersion': '2.11.0',
                'serverBuild': '2023-11-29.2207.3251a05',
            },
            'ping': self.ping,
            'pings': [],
            'jitter': 0,
            'latency': {
                'connectionProtocol': 'wss',
                'tcp': {
                    'jitter': 0,
                    'rtt': {
                        'iqm': self.idle_latency,
                        'mean': self.idle_latency,
                        'median': self.idle_latency,
                        'min': self.idle_latency,
                        'max': self.idle_latency,
                    },
                    'count': 0,
                    'samples': [],
                },
            },
            'guid': str(uuid.uuid4()),
            'serverSelectionMethod': 'auto',
            'uploadMeasurementMethod': 'remote',
            'upload': self.upload,
            'uploadSpeeds': {},
            'download': self.download,
            'downloadSpeeds': {},
            'downloadLatency': {
                'tcp': {
                    'jitter': 0,
                    'rtt': {
                        'iqm': self.download_ping,
                        'mean': self.download_ping,
                        'median': self.download_ping,
                        'min': self.download_ping,
                        'max': self.download_ping,
                    },
                    'count': 0,
                    'elapsed': 0,
                    'timestamp': 0,
                },
            },
            'uploadLatency': {
                'tcp': {
                    'jitter': 0,
                    'rtt': {
                        'iqm': self.upload_ping,
                        'mean': self.upload_ping,
                        'median': self.upload_ping,
                        'min': self.upload_ping,
                        'max': self.upload_ping,
                    },
                    'count': 0,
                    'elapsed': 0,
                    'timestamp': 0,
                },
            },
            'servers': {},
            'connections': {},
            'hash': self.sig,
            'clientip': '1.1.1.1',
        }

    def fake_speedtest(self):
        headers = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'fr',
            'content-type': 'application/json;charset=UTF-8',
            'origin': 'https://www.speedtest.net',
            'priority': 'u=1, i',
            'referer': 'https://www.speedtest.net/',
            'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        }

        json_data = self.get_json_data()
        response = requests.post('https://www.speedtest.net/api/results.php', headers=headers, json=json_data)

        if isinstance(response.json(), list):
            return False

        return response.json()['resultid']

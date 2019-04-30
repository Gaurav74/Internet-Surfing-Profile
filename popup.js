//decode the Array
function decode(hex)
    {
        // initialize the ASCII code string as empty.
        let ascii = "";

        for (let i = 0; i < hex.length; i++) {

            // extract two characters from hex string
          ascii+=String.fromCharCode(Number(hex.charAt(i).charCodeAt(0))-1);
        }

        return ascii;
    }
//extractHostname
function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > (-1)) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];
  return hostname;
}
//

let linkArray = [];
let typedArray = [];
let reloadArray = [];
let blocked = [];
var uniqueURL = [],
  totalCount = [];




function paramGenerator() {
  let selectedTime = document.querySelector('input[name = "timeChoose"]:checked').value;
  if (selectedTime === "today") {
    let time = Date.now();
    time = time - (24 * 60 * 60 * 1000);
    return {
      text: "",
      startTime: time
    };
  } else if (selectedTime === "week") {
    let time = Date.now();
    time = time - (7 * 24 * 60 * 60 * 1000);
    return {
      text: "",
      startTime: time
    };
  }
}

function searchHistory() {
   linkArray.length=0;
   typedArray.length=0;
   reloadArray.length=0;
   blocked.length=0;
  chrome.history.search(paramGenerator(), function(data) {
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      //
      let myurl=data[i].url;
        let urlArray=myurl.split('.');
        bool = false;
        for(let j=0;j<urlArray.length && !bool;j++){
          if(urlArray[j]==="www" || urlArray[j]==="com" ){
            continue;
          }
        for (let i = 0; i < adultDomains.length && !bool; i++) {
          if (urlArray[j]===decode(adultDomains[i])) {
            bool = true;
          }
        } }
        if(bool){
          blocked.push({
            title: data[i].title,
            url: data[i].url,
            lastVisitTime: data[i].lastVisitTime,
            visitCount: data[i].visitCount
          });
        }else {
          visit(data[i].title, data[i].url, data[i].lastVisitTime, data[i].visitCount);
        }
    }
});

}
searchHistory();



function visit(title, url, lastVisitTime) {
  chrome.history.getVisits({
    url: url
  }, function(visitData) {
    totalCount.push(visitData.length);
    for (let i = 0; i < visitData.length; i++) {
      if (visitData[i].transition === "link") {
        linkArray.push({
          title: title,
          url: url,
          lastVisitTime: lastVisitTime,
          visitTime: visitData[i].visitTime,
          transition: visitData[i].transition
        });
      } else if (visitData[i].transition === "reload") {
        reloadArray.push({
          title: title,
          url: url,
          lastVisitTime: lastVisitTime,
          visitTime: visitData[i].visitTime,
          transition: visitData[i].transition
        });
      } else if (visitData[i].transition === "typed") {
        typedArray.push({
          title: title,
          url: url,
          lastVisitTime: lastVisitTime,
          visitTime: visitData[i].visitTime,
          transition: visitData[i].transition
        });
      }
    }
  });

}
// slice url
function sliceNameURL(data){
  if(data.toString().length > 40){
    return data.toString().slice(0,40)+"...";
  }
  else {
    return data;
  }
}


//make general table
function makeTable(array) {
  deleteTable();
  let table = document.getElementById('urlTable');
  if(array.length==0){
    var thr = table.appendChild(document.createElement('tr'));
    var th1 = thr.appendChild(document.createElement('th'));
    th1.appendChild(document.createTextNode('NO DATA'));
    var th2 = thr.appendChild(document.createElement('th'));
    th2.appendChild(document.createTextNode('NO DATA'));
    var th3 = thr.appendChild(document.createElement('th'));
    th3.appendChild(document.createTextNode('NO DATA'));
    var th4 = thr.appendChild(document.createElement('th'));
    th4.appendChild(document.createTextNode('NO DATA'));


  }else{
  var thr = table.appendChild(document.createElement('tr'));
  var th1 = thr.appendChild(document.createElement('th'));
  th1.appendChild(document.createTextNode('S.NO'));
  var th2 = thr.appendChild(document.createElement('th'));
  th2.appendChild(document.createTextNode('TITLE'));
  var th3 = thr.appendChild(document.createElement('th'));
  th3.appendChild(document.createTextNode('VISIT TIME'));
  var th4 = thr.appendChild(document.createElement('th'));
  th4.appendChild(document.createTextNode('LAST VISIT'));

}


  for (var i = 0; i < array.length; i++) {
    var tr = document.createElement('tr');

    var td1 = document.createElement('td');

    var td2 = document.createElement('td');
    var a = td2.appendChild(document.createElement('a'));
    a.appendChild(document.createTextNode(sliceNameURL(array[i].title) || sliceNameURL(array[i].url)));
    a.href = array[i].url;
    a.setAttribute('width',100);
    a.addEventListener('click', onAnchorClick);

    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var text1 = document.createTextNode(i + 1);

    var d = new Date();
    d.setTime(array[i].visitTime);
    var n = d.getUTCFullYear();
    var myDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + n;

    var text3 = document.createTextNode(myDate);

    d.setTime(array[i].lastVisitTime);
    n = d.getUTCFullYear();
    myDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + n;

    var text4 = document.createTextNode(myDate);

    td1.appendChild(text1);

    td3.appendChild(text3);
    td4.appendChild(text4);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    table.appendChild(tr);
  }
  document.body.appendChild(table);
}


// create block table
function makeBlockTable(array) {
  deleteTable();
    let table = document.getElementById('urlTable');
  if(array.length==0){
    var thr = table.appendChild(document.createElement('tr'));
    var th1 = thr.appendChild(document.createElement('th'));
    th1.appendChild(document.createTextNode('NO DATA'));
    var th2 = thr.appendChild(document.createElement('th'));
    th2.appendChild(document.createTextNode('NO DATA'));
    var th3 = thr.appendChild(document.createElement('th'));
    th3.appendChild(document.createTextNode('NO DATA'));
    var th4 = thr.appendChild(document.createElement('th'));
    th4.appendChild(document.createTextNode('NODATA'));

  }else{

  var thr = table.appendChild(document.createElement('tr'));
  var th1 = thr.appendChild(document.createElement('th'));
  th1.appendChild(document.createTextNode('S.NO'));
  var th2 = thr.appendChild(document.createElement('th'));
  th2.appendChild(document.createTextNode('TITLE'));

  var th3 = thr.appendChild(document.createElement('th'));
  th3.appendChild(document.createTextNode('VISIT TIME'));
  var th4 = thr.appendChild(document.createElement('th'));
  th4.appendChild(document.createTextNode('VISIT COUNT'));

}

  for (var i = 0; i < array.length; i++) {
    var tr = document.createElement('tr');

    var td1 = document.createElement('td');

    var td2 = document.createElement('td');
    var a = td2.appendChild(document.createElement('a'));
    a.appendChild(document.createTextNode(sliceNameURL(array[i].title) || sliceNameURL(array[i].url)));
    a.href = array[i].url;
    a.addEventListener('click', onAnchorClick);

    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var text1 = document.createTextNode(i + 1);

    var d = new Date();
    d.setTime(array[i].lastVisitTime);
    var n = d.getUTCFullYear();
    var myDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + n;

    var text3 = document.createTextNode(myDate);
    var text4 = document.createTextNode(array[i].visitCount);

    td1.appendChild(text1);

    td3.appendChild(text3);
    td4.appendChild(text4);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    table.appendChild(tr);
  }
  document.body.appendChild(table);
}

function deleteTable() {
  var elem = document.getElementById('urlTable');

  if (typeof elem != 'undefined') {
    while (elem.hasChildNodes()) {
      elem.removeChild(elem.firstChild);
    }
  }
}

function onAnchorClick(event) {
  chrome.tabs.create({
    url: event.srcElement.href
  });
  return false;
}

///add event of radio box
var radios = document.querySelectorAll('input[type=radio][name="transition"]');

function changeHandler(event) {

  let selectedTransition = document.querySelector('input[name = "transition"]:checked').value;
  if (selectedTransition === 'blocked') {
    makeBlockTable(blocked);
  } else if (selectedTransition === 'typed') {
    makeTable(typedArray);
  } else if (selectedTransition === 'link') {
    makeTable(linkArray);
  } else if (selectedTransition === 'reload') {
    makeTable(reloadArray);
  }
}

Array.prototype.forEach.call(radios, function(radio) {
  radio.addEventListener('change', changeHandler);
});

function eventTimeChoose() {
  Array.prototype.forEach.call(radios, function(radio) {
    radio.checked=false;
  });
  searchHistory();
  deleteTable();

}


var radiosTime = document.querySelectorAll('input[type=radio][name="timeChoose"]');
Array.prototype.forEach.call(radiosTime, function(radio) {
  radio.addEventListener('change', eventTimeChoose);
});






// Given an array of URLs, build a DOM list of these URLs in the
// browser action popup.
function buildPopupDom(mostVisitedURLs) {
  var popupDiv = document.getElementById('topSite');
  var ol = popupDiv.appendChild(document.createElement('ol'));

  for (var i = 0; i < mostVisitedURLs.length && i<9; i++) {
    var li = ol.appendChild(document.createElement('li'));
    var a = li.appendChild(document.createElement('a'));
    a.href = mostVisitedURLs[i].url;

    a.appendChild(document.createTextNode(sliceNameURL( mostVisitedURLs[i].title)));
    a.addEventListener('click', onAnchorClick);
  }
}

chrome.topSites.get(buildPopupDom);

/*
these methods will track basic privacy options
*/
//service events
chrome.privacy.services.safeBrowsingEnabled.get({}, function(details) {
  if (details.value)
    document.getElementById('safeBrowsingEnabled').innerText = "ON";
  else{
    document.getElementById('safeBrowsingEnabled').innerText = "OFF";
    document.getElementById('recommendSafeBrowsing').innerText="Toggle to Safeguard yourself from Web";
  }
});

chrome.privacy.services.searchSuggestEnabled.get({}, function(details) {
  if (details.value)
    document.getElementById('searchSuggestEnabled').innerText = "ON";
  else
    document.getElementById('searchSuggestEnabled').innerText = "OFF";
});

chrome.privacy.services.alternateErrorPagesEnabled.get({}, function(details) {
  if (details.value)
    document.getElementById('alternateErrorPagesEnabled').innerText = "ON";
  else
    document.getElementById('alternateErrorPagesEnabled').innerText = "OFF";
});

chrome.privacy.services.autofillCreditCardEnabled.get({}, function(details) {
  if (details.value)
    document.getElementById('autofillCreditCardEnabled').innerText = "ON";
  else{
    document.getElementById('autofillCreditCardEnabled').innerText = "OFF";
  document.getElementById('recommendCreditCard').innerText="Anonymous user can misuse";
  }
});

chrome.privacy.services.passwordSavingEnabled.get({}, function(details) {
  if (details.value)
    document.getElementById('passwordSavingEnabled').innerText = "ON";
  else{
    document.getElementById('passwordSavingEnabled').innerText = "OFF";
  document.getElementById('recommendPasswordSaving').innerText="Anonymous user can misuse";
  }
});

//websites
chrome.privacy.websites.doNotTrackEnabled.get({}, function(details) {
  if (details.value)
    document.getElementById('doNotTrackEnabled').innerText = "ON";
  else{
    document.getElementById('doNotTrackEnabled').innerText = "OFF";
document.getElementById('recommendTrackEnabled').innerText="Toggle to Safeguard yourself from Web";
  }
});

chrome.privacy.websites.thirdPartyCookiesAllowed.get({}, function(details) {
  if (details.value)
    document.getElementById('thirdPartyCookiesAllowed').innerText = "ON";
  else
    document.getElementById('thirdPartyCookiesAllowed').innerText = "OFF";
});

//network
chrome.privacy.network.networkPredictionEnabled.get({}, function(details) {
  if (details.value)
    document.getElementById('networkPredictionEnabled').innerText = "ON";
  else
    document.getElementById('networkPredictionEnabled').innerText = "OFF";
});

chrome.privacy.network.webRTCIPHandlingPolicy.get({}, function(details) {
  document.getElementById('webRTCIPHandlingPolicy').innerText = details.value.toUpperCase();

});

/////////////////////////////////////////////////////////////////////////////////////////////////
let adultDomains=[
"qpsonbuvsfxpnfo","ovefnpnqipupt","tfdjotvsbodf","cjhgsffnbuvsf","nbuvsf.xpnfo.uvcf","ipuovefnbuvsft","pmetfyzcbcft","nbuvsfbttqjdt","nbuvsf41qmvt",
"nbuvsfbnpvs","uifnpntgvdljoh","cppcznjmg","gboubtujdxpnbot","yyynbuvsfqptu","bmmpmeqjdt","mfobxfuipmf","nbuvsf","xjgf{jmmb","divcczhbmmt",
"ovefnbuvsftqjdt","nbuvsfbm","uifynjmg","dpdpnjmgt","{njmgt","xjme.nbuvsft","ipsoz.nbuvsft","hsboenbcftuuvcf","cftunjmguvcf","offenjmg",
"hjsmnbuvsf","cftunbuvsfdmjqt","mvtugvmpmejft","sjpnpnt","nbuvsfiputfy","cfuufsnjmgt","njmgjpobjsf","pmefsdifssz","tfyznjmgqvttz","nbuvsfqpsoqjdt",
"bdujpo47","ejbobqptu","cbcftdmvc","mpwfmz.nbuvsf","cftunbuvsftuivnc","nzgsffnpnt","njmgbuxpsl","njmghbmt","pmefsxpnfobsdijwf","njmgnpntqjdt",
"qpsopwjefp","tujgmfstnjmgt","nbuvsfobht","nbuvsfoblfetmvut","uhqnbuvsfxpnbo","jefbmxjgft","nbuvsfxjudi","irnbuvsfnpwt","nbuvsf.xpnfo.uvcf","pmefsxpnfoubcpp",
"dipdpnjmg","njmgqbsbopjb","npntojhiukpc","nbuvsfjouspt","cppmpp","cjhcvuunbuvsf","nbuvsfuvcf","nbuvsf41.56","nbuvsfdppm","nbnjubuvcf",
"gsffnbuvsfwjefp","tjmlznpnt","npntdmbo","gvdlnbuvsfxipsf","nbuvsfevnnz","ipugsffnjmgt","fm.mbejft","yyynpndmjqt","jefbmnjmg","bmfynbuvsft",
"ljohtj{fcsfbtut","nbuvsfmbejft","cjhujutoblfe","yfcpozhjsmt","ovnbuvsfxpnfo","xpnfojozfbst","nbuvsfifsf","njmgqjdtifsf","nbuvsfqjdtbsdijwf","wjfxnbuvsf",
"xpnfonbuvsfqjdt","npntqjdt","dmfpnuvsf","njmg.gvdljoh","nbuvsfdifssz","jnnpsbmnbuvsft","qsfuuz.nbuvsft","nbuvsfdmjuivoufs","jmpwfnbuvsfxpnfo","ovefnbuvsfqvttz",
"ovefnpnboecpz","nzhsbooz","fspujduffot","qvttz.nbuvsf","gbutfyzhjsmt","51tpnfuijohnbh","uhqnbuvsfxpnbo","bnb{johnbuvsftmvut","njmguvcfwjet","nzietipq",
"nbuvsfipmft","wjqpmejft","kvjdz.nbuvsft","ipufmnbuvsft","hbzuvcf","ibsetfyzzpvqpsoivc","mfxe.cbcft","bevmuuvcf","nbuvsftfyz","hbmtbsdijwf",
"nbuvsfhjsmtfyqjdt","nbuvsf.gps.zpv","nvmmjhbotnjmgt","hsbdfgvmnjmg","npntgpsqpso","tfyzipunjmg","b{hbmt","uifnbuvsfmbejft","binjmg","difbuxjgf",
"qjdtcppc","bhfenbnbt","cjhujutnjmg","nuvsfnpntqpso","pmefs.cfbvuz","fnqgmjy","ovnpnt","mbeznpn","qfujufqpso","hsboozibjsz",
"hsbnbufvst","tfyz.pmefst","gsfti.hbmmfsjft","ovefnbuvsfnjy","bmbotbobm","nbuvsf.mjcsbsz","gjmuiznbnbt","nbuvsf.cfbdi","tfyvbmpmefst","ipsoz.pmefst",
"pmefsljtt","xfuibjszxbut","fspujd.pmefst","nbuvsfnpnqjdt","nbuvsfebmmz","qmbdf32","uffoibob","dmbttjd.npnt","hsboenbnnbqjdt","ynjmgqjdt",
"ipudijdlt","fcpozgboubtjft","njmgcbol","gsffnbuvsfqpsoqjdt","bhfedvout","njmgtfdujpo","cftunjmgtqpso","fwfszebzdbnt","bevmusfwjfxt","jdfnbuvsft",
"nbuvsf5","njmgfsb","njmgkbn","ccxqpsoqjdt","qpsoyyy","njmgljtt","divcczhjsmqjdt","fydjujohnbuvsft","ibjsznbuvsfhjsmt","qbnfmbqptu",
"8gffm","uvcfgfmmbt","tfyznbuvsfuivnct","tfyzcvuuqjdt","tfyzipunjmgt","tfdsfubszqjdt","oblfe.npnt","npniboekpc","tfyznbuvsfuivnct","qpsotujdlz",
"ibjsznjmgqjdt","nbuvsfcspuifsuivnct","ipunpntqpso","ovefnbuvsfnjy","41qmvthjsmt","xjgftcbol","njmgtbsfb","qpsopsjwfs","njmgtcfbdi","nbuvsfhvjef",
"ebjmzpmefst","btlzpvsnpnnz","gsff.qpso.qjdt","nbuvsfepmmt","kvjdzhsbooz","nbuvsfqpsoifsf","oblfepmecbcft","tusjqqjoh.npnt","tfyznbuvsfqvttjft","pxfspujdb",
"pme.wvmwb","pmenpntuhq","qptjoh.nbuvsft","npntfdtubtz","hsbdfgvmnpn","xfunbuvsfqjdt","xjgfoblfe","nbuvsfyyydmjq{","nbuvsfqmbdf","sjpnjmg",
"gsftipmefst","irpmejft","cjhujutgsff","bnbufvs.mjcfsujot","nbuvsfqpsorvffot","bnbdmjqt","fspujdqmbdf","nzpomzie","bnbqjdt","41zpnjmg",
"gvdled","npnnzyyynpwjft","uffoqvttz","jnpntfy","njmggsffqjduvsft","yyynbuvsfqptu","vojrvftfyznpnt","gvdlnbuvsfxipsf","hfoumfnpnt","efwjboudmjq",
"pmetxffu","hsboozqpsoqjdt","mfxenjtusftt","xpsmeyyyqipupt","txffunbuvsfqjdt","pmeqppo","tfyznbuvsfqjdt","hppehsboozqjdt","ebhbz","sboezibht",
"uifhsbooz","nbuvsfnpntfy","nbuvsftpsu","jnnpeftunpnt","jnnbuvsfxpnfo","cjhcpuz5gsff","ujoz.dbnt","pmexpnbogbdf","ipnf.nbeoftt","qptjohxpnfo",
"nbuvsftfotbujpot","gjmuizpmejft","nbuvsfdmjut","npntjoqpso","nbuvsfcbcftqpsop","nbuvsfjompwf","cjhujutqpso","yyypmefst","gsffnjmgtjuf","qpsopyym",
"rvffopgnbuvsf","ipunpntqjdt","gsffnjmgqpsoqjdt","btimfzsobejtpo","cj{{{qpsop","tfyz.mjolt","iputfyzuffotqipupt","uffnot.qjd","wjefp.qpsop","nstljo",
"hpcfvsfuuft","bduvbmmzbuusbdujwfbnbufvst","tfyzoblfebnbufvshjsmt","ovefebsft","bnbufvs.tfyzt","ipuipnfnbefqjy","ipubnbufvsdmjq","wpzfvstqpsu","vqtljsu","gbllv",
"qpsonjssps","zpvkj{{","jotfyu","qbivcbe","yuvcf","cpzujlpm","cffh","liv29","hpo{p","fttfqpso",
"nzgsffqpsowjefpt","gsffpoft","fgvlu","ofxtgjmufs","yyywjef","wjefp.pof","qpsotubsibohpvu","csffpmtpo","qpso831","dpmmfhfivnps",
"cbstuppmtqpsut","ipmmzxppekj{{","tijucsjy","yyytvnnfs","qpsoz","wjefp","ejywj","qpsooblfehjsmt","sfbmjuzqbttqmvt","ejhjubmqmbzhspvoe",
":hbh","ljdlbtt","yibntufs","tfy4","csbwjpuffot","lbuftuvcf","zpvsmvtu","xjywj","qpsouvcfwje{","4npwt",
"cv{{xpl","mbshfqpouvcf","ljdlbtt","hpebpnf","ovwje","21qpjou{","ksvol","qpsofscspt","qpsoejh","cjhujo{",
"9otfy","jnbhfgbq","bevmugsjfoegjoefs","qpsopepjep","iespmfu","yqpsoljoh","qpsoplvuvtv","qpso{{","qpsopgpsp","njmgqpsofu",
"ljol","trvjsujohnbtufsz","uifipuqjdt","qpg","fbuzpvpvu","qmbzcpz","njmgtbggbjs","joejbohjmnb","qsjwbuf","gvdl.njmg",
"gpup.fspujdb","ebvmuqpsowjefpy","cpohbdbnt","mbtutfyf","qjoltpgb","qjoldvqje","pomzqpsohjg","tfyzpop","tijucsjy","npuifsmftt",
"uifipuqjdt","kpodkh","gs.optusbebnvt","nbtuvscbujpobeejdupo","kbqboftfyyyuvcf","ljmpqjdt","gjoe.cftu.mjohfsjf","evtuzqpso","dmfpuffofs","uffo29btt",
"fufsobmeftjsf","tfyzuffotqipupt","uffoqpsokpz","cvccmfcvuuqjdt","bmmpguffot","ujoztpmp","nzoblfeuffot","zpvohnjou","zpvqpso","mvtuhjsmgsjfoet",
"zpvohyyyqjdt","qjoluffoqjdt","dmju8","gjoe.cftu.wjefpt","gsffljmpdmjqt","ovefbsutubst","gsffqpsoes","tvqfsejptbt","ejtdp.hjsmt","mfxe.hjsmt",
"nfhb.uffo","ifhboqpso","qpsotubsojswob","mmwfmfbl","svef","bobubswbtobwjefpt","gvdlnzjoejbohg","eftjoejbo","jtdjoejb","uvcfhphp",
"tqbolcboh","zfigvo","joejbolbiboj","qpsonel","uvcftubdl","eftjlbiboj","yftj","eftjubmft","bmmjoejbotfy","uvcfydmjqt",
"cpzeem","dpnjdnbtbmb","tmvumpbe","cfgvdl","qpso31","bmmjoejbotfytupsjft","djofevojb","cpmmzxppe.tfy","gvokbev","jmpwfjoejbotfy",
"izbu","divebjnb{b","bevmuqipofdibumjoft","tjcmph","gvdljoh9","dmpbluvcf","joejboipukplft","xfhsfu","joejbothpbobm","eftjqbqb",
"bmj{kplft","kmpctufs","eftjlbnbtvusb","nziputjuf","ijoej.tfy","cvmmqpso","pjhi","kj{{qpsouvcf","opowfhkplft","ffmuvcf",
"ibqpsouvcf","ijoejpme","joembotfy","4sbu","5ifo","bgsjdbotfywjefpt","cbobobcvooz","dvufqpsowjefpt","eftjnvshb","eftjtfydmjqt",
"etmbez","fspujdqfsgfdujpo","ft/qpso","hbzqpsojvn","hsbdfgvmoveft","ipu.ebuft","irmjolt","ipx.ep.zpv.qspevdf.npsf.tfnjobm.gmvje","joejboqpsouvcf","joejbotfy5v",
"kbw.qpso","ljsuv","mfhbmqpsop","mvcpfqpsop","nzqpsocpplnbslt","qjolzuifljolz","qpsogspnd{fdi","tfytfy","tfyyyyj","tifnbmf",
"uffohbzqpsouvcf","uifgsffdbntfdsfu","uifqpsoevef","npntufbditfy","qfubsebt","ywjefpt","9:","bevmutfyuvcf","bmpibuvcf","bobmtfytubst",
"cbcptbt","cpnoqpso","csb{{fst","dbmmcpzjoejb","dbn5","dipmpuvcf","dmjqivoufs","dvmmpthsbujt","dvnmpvefs","ebsfsjoh",
"esuvcfs","fqjdqpsouvcf","fqpsofs","gbqup","gmjsu5gsff","gsffpoft","gsftiqpso","gvdldvdl","hsbdfgvmoveft","hbzcpztuvcf",
"gvr","ibjsz","ijoejtfy","jlopxuibuhjsm","joejboqpsopwje","joejboqpsowjefpt","jyyy.uvcf","jyyy","kj{{ivu","mbcbujepsb",
"mfdif7:","mjwkbtnjo","mpdbtqpsgpmmbs","mvtitupsjft","nd.oveft","njmgnpwt","nzgsffdbnt","obvhiuz","qfohvjowjet","qfsgfduhjsmt",
"qfsvdbtfsbt","qjolxpsme","qmbzcpz","qmbzwje","qpsoivc","qpsop","qpsopsd","qpsouvcf","qvsjubobt","sfeuvcf",
"sl","spvoeboecspxo","tfswjqpsop","tfypdfbo","uffoqpsoyyy","uifgsffdbntfdsfu","uobgmjy","usvuipsebsfqjdt","uvcf9","uvcfhbmpsf",
"wjefptefnbevsbty","xbudinzhg","y.ip","yjyy","yoyy","yuvcf","ywjefptobdjpobm","yyy","zpvkj{{","zpvqpso",
"yibntufs","tfyuhfn","yyy","kfvy.gmbti.tfyz","qvsfccxuvcf","cbcft","gpupnvkfsft/qjcpoft","svccfs.ljohepn","tbwjubcibcij","qjolwjtvbmuhq",
"boubswbtob","ipu.hjg{","mfdifdbmmfouf","qbsfkbtgpmmboep","gmjsuipplvq","dfsebt","dibuvscbuf","zpvohqpsowjefpt","ovefwjtub","3hbzcpzt",
"qpsoyyyuvcft","mfebvqijof","gsffy/","nfhbwjefpqpsop","qpsopdibve","hplbczmf","cefokpznpsf","qfubsebt","upspqpsop","dpofkpy",
"tbncbqpsop","wpzfvsqjqj","nbohbttfy","hpvmoft","yqpsophbzt","joejfoof.tfyz","bsbcfcbjtf","pibtjbujrvf","qpso","yyypoyyy",
"tfyyyepmm","yyywjefptfy","hpo{pyyynpwjft","lff{npwjft","yyy","qpsjohb","wjefptyyyqvubt","mjtbboompwfst22","i44u","qsfnjfsdbtujohqpsop",
"nbspdbjofovf","qfsgfduhjsmt","kfggevoibngvdlepmm","qpsonpujpo","hpshfpvtmbejft","gjmmf.ovf.wjefp","uffotopx","uifpggjdjbmmpvjtfkfotpo","cbohcspt","zpvsbuifs",
"cppumvt","dpofkpy","uppo{uvcf","upq.dibuspvmfuuf","wjefptgjmmftdibveft","gjmmfdibvef","gfnnftnvsfty","mjcfsuffobhf","dpggfuvcf","bxftpnffmmbmpwf",
"yoyyhjgt","hbzhbvufnfmb","tbpvmcbgkpkp","qpsopgfnnfcmbdl","tfypobqsjb","cfvsfuufipu","xppetupdlsfcpso","gsfftfy","qfmjdvmbtqpsophsbujtyyy","qpsop.bmhfsjfoof",
"cfmmft.gfnnft.bsbcft","mftcjfooftyyy","eft.gjmmft.tfyz","wjefpt.qpsop.dibveft","yhpvjoft","dpvmfvsjwpjsf","4bojnbmtfyuvcf","npodpuvcf","npvqbsltusffu","tfypdfbo",
"tfydpbdibqq","gfnepnfdqjsf","cbcptbt","hvjef.btjf","cfbvydvm","nbhisfcjooft","byoyyy","yoyy.gsff","yoyy","csbwpuvcf",
"gfnnftqpsop","uvcfevqpsop","wjefpt.tfyf","wjefp.qpsop","xxx/svcjbt2:","poyyjmmf","btjbujrvf.gfnnf","nbtbmpqfcmbdl","cfbvuzboeuifcfbse2","cfbvujgvm.ovef.uffot.fyqptfe",
"qpsop.nbspdbjof","7:svfqpsop","gvdlnzdifbujohtmvuxjgf","bsbcf.tfyz","gjmn.qpsop.cmbdl","tfyf.fwcpoz","hsbujtifoubj","dpdipoofwjefpty","dibvebttfevtfyf","wjefptbobmfty",
"qpsopuboujrvf","epsdfmuw","gfnnfty","cpvujrvf.tfyz","xxx/tbmpqf.nbspdbjof","qpsopdpmvncjb","kfvofuuf29","tfyf3btjbujrvf","sfeuvwf","mft.hsptft",
"ofyyy","gsfftfy","wjefptqpsopobdjpobm","yyyljolz","zbtnjosbnpt","uvljg","qpsop.xjgf","gjmn.yyy.cmbdl","fwfsz.tfdpoet","bevmuxpsl",
"cffh","csb{{fstofuxpsl","tfyuvcfmjolt","yyycvolfs","8eph","wjwuipnbt","qpso11","uffotopxywjefpt","y.bsu/dpn","dibuvscbuf",
"qjolxpsme","qboebnpwjft","nvz{pssbt","wjefpt.qpsop","vqmvtu","tifnbmft","cjhcppctbmfsu","dvmy","hbz54","cmphgbmdpotuvejpt",
"gbmdpotuvejpt","qsfnjvn","pnfhbqpsop","tqfdjbmhbzt","hhhbz","obvujmjy","pwjefpy","b{ufdbqpsop","qpsopyym","tfyhsbuvjut",
"qpsoptgjmnt","ifscbmwjbhsbxpsme","qsjnfdvswft","ycbcf","xfcqoveft","ipsozcppl","qjotfy","tnvuuz","esfbnnpwjft","qpsoivcgjmmftbmpqf",
"hjsmzhjgqpso","bsbcjdebodfwjefp","lfmmzejwjof","uvcfqpsotubst","wjoubhfibjsz","mpplbuwjoubhf","qpsopsbnb","btt5bmm","djoeznpwjf","kj{{mf",
"pomzhjsmwjefpt","spgmqpu","tqbolxjsf","bsbcftfyz","nfhbnpwjf","oblfecppct","uffodbnwjet","ovefcppctipuqjdt","tvhbsccx","tfycpucpoobttf",
"qpqvsmt","2kbqpotfy","ovefnbuvsfxpnfoqipupt","fspujdcfbvujft","njmgt41","gsftinbuvsfqpso","nbuvsftijof","xfunbuvsfxipsft","nbuvsft.qipupt","nbuvsf.hbmmfsjft",
"pxtnvu","nbuvsftubujpo","xfcdbn","nbuvsfmmf","xpnfonbuvsfqjdt","bmm.gsff.ovef.pme.hsbooz.nbuvsf.xpnfo.yyy.qpso.qjdt","nbuvsfqpsoivc","ovefpme","vojrvftfyznpnt","ovef.pmejft",
"sjpnbuvsf","ipu.oblfe.njmgt","tujgmfstnpnt","nvmujnbuvsf","pmeipunpnt","nbuvsfpsbdmf","ivohsznbuvsft","njmgpvt","xbudifstxfc","fspnbuvsft",
"npn61","hsboozyyy","nbuvsftjotupdljoht","jnbuvsfxpnfo","xfunbuvsfxpnfo","nbuvsfboezpvoh","npntifsf","sjpnpnt","ljttnbuvsfthp","cjufgbjn",
"njmgjpobjsf","tfyznbuvsfuivnct","nbuvsptfyz","7nbuvsf:","ipuoblfepmejft","hpmefo.npnt","nbenbnbt","xpnbopmefs","nbuvsfmboe","npuifstujut",
"votibwfoqvttjft","qpsonbuvsfqjdt","216nbuvsft","npntubcpp","csptmjohfsjf","fmefsmz.xpnfo","vqtljsuupq","cvtizqvttjft","bnbufvsnbuvsfxjwft","vojwfstfpme",
"votibwfohjsmt","pmefsobtuzcjudift","nbuvsfxbou","kvmjfqptu","nvmmjhbotnjmgt","cftunbuvsfxpnfo","sjpnbuvsf","nbuvsf.pshbtn","jompwfxjuicppct","sjpujut",
"oblfecvtuzujut","btt.cvuu","nbuvsfmbejftqjdt"
];

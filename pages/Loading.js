import { Circle} from 'better-react-spinkit';

function Loading() {
  return (
    <center style={{display:'grid',placeItems:'center',height:"100vh"}}>
      <div>
        <img src='https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-whatsapp-mobile-software-icon-png-image_6315991.png'
         alt=""
         height={150}
          />
          <Circle color='#3CBC28' size={60} />
      </div>
    </center>
  )
}

export default Loading

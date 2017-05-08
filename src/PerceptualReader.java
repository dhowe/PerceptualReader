import processing.core.PApplet;
import rita.*;
import rita.support.behavior.RiLerpBehavior;

public class PerceptualReader extends PApplet
{
  int LEADING = 40, NUM_LINES_ABOVE = 3, NUM_LINES_BELOW = 3;
  int DISPLAY_WIDTH = 480, DISPLAY_X = 133;
  
  static boolean isApplet = true;
  
  float lineW, spaceW, speed=.1f;
  int mouseDownX, arrowSpeed=-1;
  RiText driver, words[][];
  RiLerpBehavior lerp;
  boolean dragging;
  String text;

  public void setup()
  {
    size(727, 387);
    
    frameRate(50);
    RiText.disableAutoDraw();
    RiText.createDefaultFont(this, "Baskerville", 36);

    doInitialLayout("misspeltLandings.txt");
    
    lerp = driver.createLerp(this);
    lerp.setMotionType(RiTa.EASE_OUT);
  }

  public void draw()
  {
    background(255);
    
    // figure out the horiz speed
    float shift = lerp.getValue();
    
    // but use arrows if specified
    if (arrowSpeed != 0) 
      shift = arrowSpeed;

    // and keep a minimum speed
    if (abs(shift) < 1) 
      shift = shift < 0 ? -1 : 1;
    
    for (int i = 0; i < words.length; i++) 
     shiftLine(i, shift);

    RiText.drawAll();
    
   
    verticalLines();
  }

  void shiftLine(int lineIdx, float offsetX) 
  {
    int offset = Math.round(offsetX);
    
    if (offset != 0) {
    
      RiText[] line = words[lineIdx];
  
      for (int j = 0; j < line.length; j++) {
        RiText word = line[j];
        Math.round(word.x);
        word.x = word.x + offset;
        if (offset<0 && offScreenLeft(word))
          word.x += lineW + spaceW;
        else if (offset>0 && offScreenRight(word))
          word.x -= lineW + spaceW;
      }
      
      updateVisibility(lineIdx);
    }
  }

  public void keyPressed() {

    switch(keyCode) {
      case 37: // right
        arrowSpeed = (arrowSpeed>0) ? arrowSpeed+1 : 1;
        break;
      case 39: // left
        arrowSpeed = (arrowSpeed<0) ? arrowSpeed-1 : -1;
        break;
    }
  }
  
  void updateVisibility(int lineIdx)
  {
    RiText[] line = words[lineIdx];
    for (int j = 0; j < line.length; j++)
      line[j].setVisible(!(offScreen(line[j])));
  }

  void verticalLines()
  {
    int[] x = { 133, 613 }; // hack
    stroke(200,0,0);
    for (int i = 0; i < x.length; i++)
      line(x[i],0,x[i],height);
  }

  void doInitialLayout(String textFile)
  {
    text = RiTa.loadString(this, textFile);
    
    if (driver == null) RiText.delete(driver);
    
    // do we need the driver?
    driver = new RiText(this, " ", DISPLAY_X, 0);
    driver.y = height/2f + 5;
    spaceW = driver.textWidth();
    driver.setText(text);
    lineW = driver.textWidth();

    if (words != null) {
      for (int i = 0; i < words.length; i++)
        RiText.delete(words[i]);  
    }
    
    // layout the words in each line
    words = new RiText[NUM_LINES_ABOVE+NUM_LINES_ABOVE+1][];
    words[NUM_LINES_BELOW] = driver.splitWords();
    float yOff = driver.y;
    for (int i = NUM_LINES_BELOW+1; i < words.length; i++) 
      words[i] = RiText.createWords(this, text, DISPLAY_X, yOff += LEADING, -1);
    yOff = driver.y;
    for (int i = NUM_LINES_BELOW-1; i >=0  ; i--) 
      words[i] = RiText.createWords(this, text, DISPLAY_X, yOff -= LEADING, -1);
    driver.setVisible(false); 

    // align rows so middle row is at start left
    for (int i = 0; i < words.length; i++)  
    {
      float offset = (DISPLAY_WIDTH * - (i-words.length/2));
      
      RiText[] line = words[i];
      
      if (offset > 0)
        offset = -1 * (lineW-offset);
      
      for (int j = 0; j < line.length; j++) 
        line[j].x += offset;
     }
  }
  
  boolean offScreen(RiText rt) {
     return offScreenRight(rt) | offScreenLeft(rt);
  }
    
  boolean offScreenRight(RiText rt) {
    return rt.x > (DISPLAY_X+DISPLAY_WIDTH);
  }
  
  boolean offScreenLeft(RiText rt) {
    return endX(rt) < DISPLAY_X;
  }
  
  float endX(RiText rt)
  {
    return rt.x+rt.textWidth();
  }
  
  float len(RiText[] line)
  {
    return (endX(line[line.length-1])-line[0].x);
  }
  
  public void mousePressed() {
    mouseDownX = mouseX;
  }
  
  public void mouseDragged() { 
    arrowSpeed = 0;
    dragging = true;
    lerp.reset((mouseX-mouseDownX)*speed, 0, 4);
  }

  public void mouseReleased() {
    dragging = false;
  }
  
  public static void main(String[] args)
  {
    isApplet = false;
    System.out.println("[INFO] Java version: "+System.getProperty("java.version"));
    PApplet.main(new String[]{PerceptualReader.class.getName()});
  }


}// end

import java.io.{BufferedWriter, FileWriter}

import org.json4s.JsonAST._
import org.json4s.jackson.JsonMethods._

import scala.io.Source

object Main {

  def main(args: Array[String]): Unit = {
    processInputFile()
  }

  private def processInputFile(): Unit = {
    val jsonString = Source.fromResource("washing_machines_raw.json").mkString
    val pairs = parse(jsonString) match {
      case JArray(elements) => elements map processElement
      case _ => throw new Exception("Expected a JArray")
    }
    writeOutputFile(pairs, "bulk.json")
  }

  private def processElement(element: JValue): (String, String) =
    element match {
      case JObject(("Code", JString(code)) :: _) => makePair(element, code)
      case _ =>
        throw new Exception("Expected a JObject whose first property is Code")
    }

  private def makePair(element: JValue, code: String): (String, String) = {
    val firstLine = compact(
      JObject(JField("index", JObject(JField("_id", JString(code))))))
    val secondLine = compact(element)
    (firstLine, secondLine)
  }

  private def writeOutputFile(pairs: Seq[(String, String)],
                              file: String): Unit = {
    val bw = new BufferedWriter(new FileWriter(file))
    pairs.foreach { pair =>
      bw.write(pair._1 + "\n")
      bw.write(pair._2 + "\n")
    }
    bw.close()
  }
}
